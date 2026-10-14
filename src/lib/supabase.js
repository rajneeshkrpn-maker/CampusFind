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
    claim_count: item.claimCount || 0
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
    submitted_at: claim.submittedAt
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

export const updateItemStatusInSupabase = async (itemId, newStatus) => {
  const { data, error } = await supabase
    .from('items')
    .update({ status: newStatus })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating item status in Supabase:', error);
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

  // If approved, update the item's status to 'recovered'
  if (newStatus === 'approved' && data?.item_id) {
    await supabase
      .from('items')
      .update({ status: 'recovered' })
      .eq('id', data.item_id);
  }

  return mapClaimFromDb(data);
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

export const markNotificationReadInSupabase = async (notifId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notifId);

  if (error) {
    console.warn('Error marking notification read in Supabase:', error);
  }
};
