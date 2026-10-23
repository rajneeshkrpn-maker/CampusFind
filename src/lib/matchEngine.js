/**
 * CampusFind Smart Item Match & Duplicate Detection Engine
 * 
 * Provides deterministic, explainable, weighted matching between:
 * 1) Lost & Found reports (to discover recovery leads)
 * 2) Same-type reports (to flag duplicate submissions for review)
 */

const KNOWN_COLORS = [
  'black', 'white', 'grey', 'gray', 'silver', 'blue', 'navy', 'red', 
  'green', 'yellow', 'gold', 'pink', 'purple', 'brown', 'orange', 'matte', 'metallic'
];

const KNOWN_BRANDS = [
  'boat', 'casio', 'wildcraft', 'dell', 'hp', 'lenovo', 'titan', 
  'milton', 'apple', 'samsung', 'noise', 'fastrack', 'realme', 'sony', 
  'acer', 'asus', 'oneplus', 'jbl', 'boult', 'zebronics', 'bata', 'puma', 'nike'
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
  'is', 'was', 'it', 'has', 'have', 'had', 'my', 'near', 'by', 'from', 'this', 
  'that', 'some', 'any', 'found', 'lost', 'item', 'campus', 'block', 'floor', 'hall'
]);

/**
 * Tokenizes and normalizes text into cleaned lowercase word stems
 */
export const tokenizeText = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
};

/**
 * Computes match similarity and explanation between a target report and candidate items
 * 
 * Weights (Total 100):
 * - Category Match: 35 points
 * - Title & Description Keyword Overlap: 30 points
 * - Brand / Color Match: 15 points
 * - Location Proximity: 15 points
 * - Date Proximity: 5 points
 */
export const scoreItemMatch = (targetItem, candidateItem) => {
  // Never match an item with itself
  if (targetItem.id === candidateItem.id) return null;

  // For lost-found matching, compare across opposite types
  // For duplicate checking, compare same types
  let score = 0;
  const reasons = [];

  // 1. Category Matching (35 pts)
  if (targetItem.category && candidateItem.category) {
    if (targetItem.category.toLowerCase() === candidateItem.category.toLowerCase()) {
      score += 35;
      reasons.push(`Identical Category (${targetItem.category})`);
    }
  }

  // 2. Keyword Overlap in Title and Description (30 pts)
  const targetWords = new Set([
    ...tokenizeText(targetItem.title),
    ...tokenizeText(targetItem.description)
  ]);
  const candidateWords = new Set([
    ...tokenizeText(candidateItem.title),
    ...tokenizeText(candidateItem.description)
  ]);

  const sharedWords = [];
  targetWords.forEach((word) => {
    if (candidateWords.has(word)) {
      sharedWords.push(word);
    }
  });

  if (sharedWords.length > 0) {
    const keywordPoints = Math.min(30, sharedWords.length * 10);
    score += keywordPoints;
    const sampleKeywords = sharedWords.slice(0, 3).join(', ');
    reasons.push(`Matching keywords: "${sampleKeywords}"`);
  }

  // 3. Color & Brand Matching (15 pts)
  const targetTextCombined = `${targetItem.title} ${targetItem.description} ${targetItem.identifyingMarks || ''}`.toLowerCase();
  const candidateTextCombined = `${candidateItem.title} ${candidateItem.description} ${candidateItem.identifyingMarks || ''}`.toLowerCase();

  const matchedColors = KNOWN_COLORS.filter(
    (c) => targetTextCombined.includes(c) && candidateTextCombined.includes(c)
  );
  const matchedBrands = KNOWN_BRANDS.filter(
    (b) => targetTextCombined.includes(b) && candidateTextCombined.includes(b)
  );

  if (matchedBrands.length > 0) {
    score += 10;
    reasons.push(`Matching brand: ${matchedBrands.join(', ').toUpperCase()}`);
  }
  if (matchedColors.length > 0) {
    score += 5;
    reasons.push(`Matching color: ${matchedColors.join(', ')}`);
  }

  // 4. Campus Location Proximity (15 pts)
  if (targetItem.location && candidateItem.location) {
    const tLoc = targetItem.location.toLowerCase();
    const cLoc = candidateItem.location.toLowerCase();

    if (tLoc === cLoc) {
      score += 15;
      reasons.push(`Same location: ${targetItem.location}`);
    } else {
      // Check building block overlap (e.g., "Library", "Block A", "Block B", "Canteen", "Gate 1")
      const buildings = ['library', 'block a', 'block b', 'canteen', 'sports', 'admin', 'gate 1', 'gate 2', 'hostel'];
      const commonBuilding = buildings.find((b) => tLoc.includes(b) && cLoc.includes(b));
      if (commonBuilding) {
        score += 10;
        reasons.push(`Nearby facility area (${commonBuilding.toUpperCase()})`);
      }
    }
  }

  // 5. Date Proximity (5 pts)
  if (targetItem.date && candidateItem.date) {
    try {
      const d1 = new Date(targetItem.date);
      const d2 = new Date(candidateItem.date);
      const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
      if (diffDays <= 2) {
        score += 5;
        reasons.push('Reported within 48 hours of each other');
      } else if (diffDays <= 7) {
        score += 3;
        reasons.push('Reported within the same week');
      }
    } catch {
      // ignore date parse errors
    }
  }

  // Cap score at 100
  score = Math.min(100, score);

  return {
    item: candidateItem,
    score,
    reasons
  };
};

/**
 * Finds suggested matches for a lost item among found items (or vice-versa)
 * Threshold: 40% similarity minimum
 */
export const findSuggestedMatches = (targetItem, allItems, minThreshold = 40) => {
  if (!targetItem || !allItems || allItems.length === 0) return [];

  // Match opposite types (Lost matches Found, Found matches Lost)
  const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
  const candidates = allItems.filter(
    (i) => i.type === oppositeType && i.id !== targetItem.id && i.status !== 'recovered'
  );

  return candidates
    .map((candidate) => scoreItemMatch(targetItem, candidate))
    .filter((result) => result && result.score >= minThreshold)
    .sort((a, b) => b.score - a.score);
};

/**
 * Detects potential duplicate reports among items of the same type
 * Threshold: 65% similarity minimum
 */
export const detectDuplicateReports = (targetItem, allItems, duplicateThreshold = 65) => {
  if (!targetItem || !allItems || allItems.length === 0) return [];

  // Compare against items of the SAME type
  const candidates = allItems.filter(
    (i) => i.type === targetItem.type && i.id !== targetItem.id
  );

  return candidates
    .map((candidate) => scoreItemMatch(targetItem, candidate))
    .filter((result) => result && result.score >= duplicateThreshold)
    .sort((a, b) => b.score - a.score);
};

/**
 * Calculates recovery turnaround statistics from items
 */
export const calculateRecoveryTurnaround = (items) => {
  const recoveredWithTimestamps = items.filter(
    (i) => i.status === 'recovered' && i.createdAt && i.resolvedAt
  );

  if (recoveredWithTimestamps.length === 0) {
    return {
      hasData: false,
      message: 'Not enough data yet'
    };
  }

  let totalHours = 0;
  recoveredWithTimestamps.forEach((i) => {
    const start = new Date(i.createdAt).getTime();
    const end = new Date(i.resolvedAt).getTime();
    const diffHours = Math.max(0, (end - start) / (1000 * 60 * 60));
    totalHours += diffHours;
  });

  const avgHours = totalHours / recoveredWithTimestamps.length;
  if (avgHours < 24) {
    return {
      hasData: true,
      display: `${Math.max(1, Math.round(avgHours))} Hours`,
      count: recoveredWithTimestamps.length
    };
  } else {
    const days = (avgHours / 24).toFixed(1);
    return {
      hasData: true,
      display: `${days} Days`,
      count: recoveredWithTimestamps.length
    };
  }
};
