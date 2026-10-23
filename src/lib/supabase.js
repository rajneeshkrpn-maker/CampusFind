import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jnefxokpnrefvtxzuhdt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZWZ4b2twbnJlZnZ0eHp1aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NTYzMDUsImV4cCI6MjEwNzUzMjMwNX0.AJMqtLxnOQB-X-wPGBYpL9ZLVJ9WwaxqPkGs8djDViY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Normalizes item row from Supabase to frontend model
 */
export const mapItemFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    category: row.category,
    description: row.description,
    location: row.location,
    date: row.date,
    time: row.time || '12:00 PM',
    status: row.status,
    image: row.image,
    reporterName: row.reporter_name,
    reporterRole: row.reporter_role,
    reporterRoll: row.reporter_roll,
    reporterEmail: row.reporter_email,
    reporterPhone: row.reporter_phone,
    identifyingMarks: row.identifying_marks,
    custodyLocation: row.custody_location,
    verificationQuestion: row.verification_question,
    claimCount: row.claim_count || 0,
    isDuplicate: Boolean(row.is_duplicate),
    duplicateOf: row.duplicate_of || null,
    resolvedAt: row.resolved_at || null,
    createdAt: row.created_at
  };
};

/**
 * Normalizes item object for DB insertion
 */
export const mapItemToDb = (item) => {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    category: item.category,
    description: item.description,
    location: item.location,
    date: item.date,
    time: item.time,
    status: item.status || (item.type === 'lost' ? 'lost' : 'found'),
    image: item.image,
    reporter_name: item.reporterName,
    reporter_role: item.reporterRole,
    reporter_roll: item.reporterRoll,
    reporter_email: item.reporterEmail,
    reporter_phone: item.reporterPhone,
    identifying_marks: item.identifyingMarks,
    custody_location: item.custodyLocation,
    verification_question: item.verificationQuestion,
    claim_count: item.claimCount || 0,
    is_duplicate: Boolean(item.isDuplicate),
    duplicate_of: item.duplicateOf || null,
    resolved_at: item.resolvedAt || null
  };
};

/**
 * Normalizes claim row from Supabase to frontend model
 */
export const mapClaimFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    itemId: row.item_id,
    itemTitle: row.item_title,
    claimantName: row.claimant_name,
    claimantRoll: row.claimant_roll,
    claimantEmail: row.claimant_email,
    claimantPhone: row.claimant_phone,
    proofDescription: row.proof_description,
    status: row.status,
    adminNotes: row.admin_notes,
    evidenceImage: row.evidence_image || null,
    submittedAt: row.submitted_at || new Date(row.created_at).toLocaleString(),
    createdAt: row.created_at
  };
};

/**
 * Normalizes claim object for DB insertion
 */
export const mapClaimToDb = (claim) => {
  return {
    id: claim.id,
    item_id: claim.itemId,
    item_title: claim.itemTitle,
    claimant_name: claim.claimantName,
    claimant_roll: claim.claimantRoll,
    claimant_email: claim.claimantEmail,
    claimant_phone: claim.claimantPhone,
    proof_description: claim.proofDescription,
    status: claim.status || 'pending',
    admin_notes: claim.adminNotes,
    evidence_image: claim.evidenceImage || null,
    submitted_at: claim.submittedAt
  };
};

/**
 * Normalizes campus issue row from Supabase to frontend model
 */
export const mapCampusIssueFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    location: row.location,
    image: row.image,
    status: row.status || 'submitted',
    reporterName: row.reporter_name,
    reporterRoll: row.reporter_roll,
    reporterEmail: row.reporter_email,
    assignedTo: row.assigned_to,
    resolutionNotes: row.resolution_notes,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Normalizes campus issue object for DB insertion
 */
export const mapCampusIssueToDb = (issue) => {
  return {
    id: issue.id,
    title: issue.title,
    category: issue.category,
    description: issue.description,
    location: issue.location,
    image: issue.image || null,
    status: issue.status || 'submitted',
    reporter_name: issue.reporterName,
    reporter_roll: issue.reporterRoll,
    reporter_email: issue.reporterEmail,
    assigned_to: issue.assignedTo || null,
    resolution_notes: issue.resolutionNotes || null,
    resolved_by: issue.resolvedBy || null,
    resolved_at: issue.resolvedAt || null
  };
};

// ==================== ITEMS SERVICE ====================

export const fetchItemsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items from Supabase:', error);
    throw error;
  }
  return (data || []).map(mapItemFromDb);
};

export const insertItemToSupabase = async (item) => {
  const dbPayload = mapItemToDb(item);
  const { data, error } = await supabase
    .from('items')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.error('Error inserting item to Supabase:', error);
    throw error;
  }
  return mapItemFromDb(data);
};

export const updateItemStatusInSupabase = async (itemId, newStatus, extraFields = {}) => {
  const updatePayload = { 
    status: newStatus,
    ...extraFields
  };
  if (newStatus === 'recovered' && !extraFields.resolved_at) {
    updatePayload.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('items')
    .update(updatePayload)
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating item status in Supabase:', error);
    throw error;
  }
  return mapItemFromDb(data);
};

export const flagItemDuplicateInSupabase = async (itemId, isDuplicate, duplicateOf = null) => {
  const { data, error } = await supabase
    .from('items')
    .update({ 
      is_duplicate: isDuplicate,
      duplicate_of: duplicateOf
    })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating duplicate flag in Supabase:', error);
    throw error;
  }
  return mapItemFromDb(data);
};

export const deleteItemFromSupabase = async (itemId) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting item from Supabase:', error);
    throw error;
  }
  return true;
};

// ==================== CLAIMS SERVICE ====================

export const fetchClaimsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching claims from Supabase:', error);
    throw error;
  }
  return (data || []).map(mapClaimFromDb);
};

export const insertClaimToSupabase = async (claim) => {
  const dbPayload = mapClaimToDb(claim);
  const { data, error } = await supabase
    .from('claims')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.error('Error inserting claim to Supabase:', error);
    throw error;
  }

  // Also increment item claim_count in items table
  try {
    const { data: itemData } = await supabase
      .from('items')
      .select('claim_count')
      .eq('id', claim.itemId)
      .single();

    if (itemData) {
      await supabase
        .from('items')
        .update({ 
          claim_count: (itemData.claim_count || 0) + 1,
          status: 'claimed'
        })
        .eq('id', claim.itemId);
    }
  } catch (err) {
    console.warn('Could not update claim_count on item:', err);
  }

  return mapClaimFromDb(data);
};

export const updateClaimStatusInSupabase = async (claimId, newStatus, adminNote = '') => {
  const { data, error } = await supabase
    .from('claims')
    .update({ 
      status: newStatus,
      admin_notes: adminNote
    })
    .eq('id', claimId)
    .select()
    .single();

  if (error) {
    console.error('Error updating claim status in Supabase:', error);
    throw error;
  }

  // If approved, update the item's status to 'recovered' and record timestamp
  if (newStatus === 'approved' && data?.item_id) {
    await supabase
      .from('items')
      .update({ 
        status: 'recovered',
        resolved_at: new Date().toISOString()
      })
      .eq('id', data.item_id);

    // Also mark any competing claims for this item as closed/rejected to avoid conflict
    try {
      await supabase
        .from('claims')
        .update({ 
          status: 'rejected',
          admin_notes: `Claim concluded. Another verified claimant was approved for this item on ${new Date().toLocaleDateString()}.`
        })
        .eq('item_id', data.item_id)
        .eq('status', 'pending');
    } catch (claimConflictErr) {
      console.warn('Could not auto-close competing claims:', claimConflictErr);
    }
  }

  return mapClaimFromDb(data);
};

// ==================== CAMPUS ISSUES SERVICE ====================

export const fetchCampusIssuesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('campus_issues')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campus issues from Supabase:', error);
    return [];
  }
  return (data || []).map(mapCampusIssueFromDb);
};

export const insertCampusIssueToSupabase = async (issue) => {
  const dbPayload = mapCampusIssueToDb(issue);
  const { data, error } = await supabase
    .from('campus_issues')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.error('Error inserting campus issue to Supabase:', error);
    throw error;
  }
  return mapCampusIssueFromDb(data);
};

export const updateCampusIssueStatusInSupabase = async (issueId, newStatus, resolutionNotes = '', assignedTo = null) => {
  const updatePayload = {
    status: newStatus,
    updated_at: new Date().toISOString()
  };
  if (resolutionNotes) {
    updatePayload.resolution_notes = resolutionNotes;
  }
  if (assignedTo) {
    updatePayload.assigned_to = assignedTo;
  }
  if (newStatus === 'resolved' || newStatus === 'closed') {
    updatePayload.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('campus_issues')
    .update(updatePayload)
    .eq('id', issueId)
    .select()
    .single();

  if (error) {
    console.error('Error updating campus issue status in Supabase:', error);
    throw error;
  }
  return mapCampusIssueFromDb(data);
};

// ==================== INQUIRIES SERVICE ====================

export const submitInquiryToSupabase = async (inquiryData) => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{
      name: inquiryData.name,
      email: inquiryData.email,
      roll_no: inquiryData.rollNo || inquiryData.roll_no,
      subject: inquiryData.subject,
      message: inquiryData.message,
      status: 'new'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting inquiry to Supabase:', error);
    throw error;
  }
  return data;
};

// ==================== NOTIFICATIONS SERVICE ====================

export const fetchNotificationsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications from Supabase:', error);
    return [];
  }
  return data || [];
};

export const insertNotificationToSupabase = async (notification) => {
  const newNotif = {
    id: notification.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: notification.title,
    message: notification.message,
    time: notification.time || 'Just now',
    read: false,
    type: notification.type || 'info',
    user_id: notification.userId || null,
    link_view: notification.linkView || null,
    link_id: notification.linkId || null
  };

  const { data, error } = await supabase
    .from('notifications')
    .insert([newNotif])
    .select()
    .single();

  if (error) {
    console.warn('Could not insert notification into Supabase:', error);
    return newNotif;
  }
  return data;
};

export const markNotificationReadInSupabase = async (notifId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notifId);

  if (error) {
    console.warn('Error marking notification read in Supabase:', error);
  }
};

// ==================== PROFILES & ROLE-BASED AUTH SERVICE ====================

export const fetchProfileByStudentId = async (studentId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('student_id', studentId.trim())
    .maybeSingle();

  if (error) {
    console.warn('Error querying profile by student_id:', error);
    return null;
  }
  return data;
};

export const fetchProfileByEmail = async (email) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('email', email.trim())
    .maybeSingle();

  if (error) {
    console.warn('Error querying profile by email:', error);
    return null;
  }
  return data;
};

export const registerStudentProfileInSupabase = async ({
  studentId,
  fullName,
  department,
  academicYear,
  email
}) => {
  // Enforce unique student ID and email at the DB layer
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      student_id: studentId.trim(),
      full_name: fullName.trim(),
      department: department.trim(),
      academic_year: academicYear.trim(),
      email: email.trim().toLowerCase(),
      role: 'student', // Client can NEVER elevate itself to admin!
      is_approved: true
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating student profile in Supabase:', error);
    throw error;
  }
  return data;
};

export const verifyAdminInSupabase = async (identifier) => {
  // Checks if the user is a verified staff or admin in the trusted database
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`student_id.eq.${identifier},email.ilike.${identifier}`)
    .maybeSingle();

  if (error || !data) {
    return { authorized: false, message: 'Account not recognized in campus staff directory.' };
  }

  if (data.role !== 'admin' && data.role !== 'staff') {
    return { authorized: false, message: 'Access Denied: Account is not authorized for staff or security portal access.' };
  }

  return { authorized: true, profile: data };
};
