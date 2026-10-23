/**
 * CampusFind — Master Admin & Staff Portal Dataset
 * Provides structured demo simulation data alongside live Supabase records.
 */

// EXACTLY 20 PROVISIONED STAFF ACCOUNTS (STAFF/HIET/100 through STAFF/HIET/119)
export const PROVISIONED_STAFF_ACCOUNTS = [
  {
    id: 'STAFF/HIET/100',
    staffId: 'STAFF/HIET/100',
    name: 'Officer Rajesh Verma',
    department: 'Proctorial & Security Services',
    desk: 'Chief Security Officer (Admin Block Reception)',
    email: 'staff100@hitech.ac.in',
    phone: 'Ext. 101',
    role: 'staff',
    status: 'Active',
    assignedIssues: 4,
    resolvedIssues: 18,
    activeCustodyItems: 6,
    joinedDate: '2023-01-15',
    lastActive: 'Just now'
  },
  {
    id: 'STAFF/HIET/101',
    staffId: 'STAFF/HIET/101',
    name: 'Officer Suresh Sharma',
    department: 'Main Gate Control',
    desk: 'Senior Proctorial Officer (Main Gate 1)',
    email: 'staff101@hitech.ac.in',
    phone: 'Ext. 102',
    role: 'staff',
    status: 'Active',
    assignedIssues: 3,
    resolvedIssues: 24,
    activeCustodyItems: 8,
    joinedDate: '2023-02-01',
    lastActive: '12 mins ago'
  },
  {
    id: 'STAFF/HIET/102',
    staffId: 'STAFF/HIET/102',
    name: 'Officer Amit Singh',
    department: 'Library Custody',
    desk: 'Custody Desk Officer (Central Library 1st Fl)',
    email: 'staff102@hitech.ac.in',
    phone: 'Ext. 103',
    role: 'staff',
    status: 'Active',
    assignedIssues: 2,
    resolvedIssues: 15,
    activeCustodyItems: 5,
    joinedDate: '2023-03-10',
    lastActive: '25 mins ago'
  },
  {
    id: 'STAFF/HIET/103',
    staffId: 'STAFF/HIET/103',
    name: 'Officer Priya Chauhan',
    department: 'Girls Hostel Safety',
    desk: 'Proctorial Inspector (Girls Hostel Complex)',
    email: 'staff103@hitech.ac.in',
    phone: 'Ext. 104',
    role: 'staff',
    status: 'Active',
    assignedIssues: 5,
    resolvedIssues: 12,
    activeCustodyItems: 3,
    joinedDate: '2023-04-12',
    lastActive: '1 hour ago'
  },
  {
    id: 'STAFF/HIET/104',
    staffId: 'STAFF/HIET/104',
    name: 'Officer Vikram Rawat',
    department: 'Academic Block A & B',
    desk: 'Facilities & Security Officer (Block A & B)',
    email: 'staff104@hitech.ac.in',
    phone: 'Ext. 105',
    role: 'staff',
    status: 'Active',
    assignedIssues: 4,
    resolvedIssues: 19,
    activeCustodyItems: 4,
    joinedDate: '2023-05-18',
    lastActive: '30 mins ago'
  },
  {
    id: 'STAFF/HIET/105',
    staffId: 'STAFF/HIET/105',
    name: 'Officer Meena Joshi',
    department: 'Boys Hostel Wing',
    desk: 'Property Return Officer (Boys Hostel Desk)',
    email: 'staff105@hitech.ac.in',
    phone: 'Ext. 106',
    role: 'staff',
    status: 'Active',
    assignedIssues: 3,
    resolvedIssues: 14,
    activeCustodyItems: 7,
    joinedDate: '2023-06-01',
    lastActive: '45 mins ago'
  },
  {
    id: 'STAFF/HIET/106',
    staffId: 'STAFF/HIET/106',
    name: 'Officer Rakesh Yadav',
    department: 'Campus Patrol & Logistics',
    desk: 'Campus Patrol Incharge (Gate 2 & Parking Area)',
    email: 'staff106@hitech.ac.in',
    phone: 'Ext. 107',
    role: 'staff',
    status: 'Active',
    assignedIssues: 2,
    resolvedIssues: 22,
    activeCustodyItems: 2,
    joinedDate: '2023-07-20',
    lastActive: '5 mins ago'
  },
  {
    id: 'STAFF/HIET/107',
    staffId: 'STAFF/HIET/107',
    name: 'Officer Deepa Malik',
    department: 'Electronics & Lab Safety',
    desk: 'Electronics Custody Specialist (Block 2 Labs)',
    email: 'staff107@hitech.ac.in',
    phone: 'Ext. 108',
    role: 'staff',
    status: 'Active',
    assignedIssues: 4,
    resolvedIssues: 29,
    activeCustodyItems: 9,
    joinedDate: '2023-08-14',
    lastActive: 'Just now'
  },
  {
    id: 'STAFF/HIET/108',
    staffId: 'STAFF/HIET/108',
    name: 'Officer Anil Kumar',
    department: 'Student Affairs & Canteen',
    desk: 'Student Welfare Proctor (Canteen & Quadrangle)',
    email: 'staff108@hitech.ac.in',
    phone: 'Ext. 109',
    role: 'staff',
    status: 'Active',
    assignedIssues: 3,
    resolvedIssues: 16,
    activeCustodyItems: 4,
    joinedDate: '2023-09-02',
    lastActive: '2 hours ago'
  },
  {
    id: 'STAFF/HIET/109',
    staffId: 'STAFF/HIET/109',
    name: 'Officer Kavita Tyagi',
    department: 'Verification Unit',
    desk: 'Verification Specialist (Academic Block C)',
    email: 'staff109@hitech.ac.in',
    phone: 'Ext. 110',
    role: 'staff',
    status: 'Active',
    assignedIssues: 1,
    resolvedIssues: 21,
    activeCustodyItems: 3,
    joinedDate: '2023-10-11',
    lastActive: '15 mins ago'
  },
  {
    id: 'STAFF/HIET/110',
    staffId: 'STAFF/HIET/110',
    name: 'Officer Sanjay Mishra',
    department: 'Sports Complex',
    desk: 'Facilities Warden (Sports Complex & Gym)',
    email: 'staff110@hitech.ac.in',
    phone: 'Ext. 111',
    role: 'staff',
    status: 'Active',
    assignedIssues: 3,
    resolvedIssues: 11,
    activeCustodyItems: 5,
    joinedDate: '2023-11-05',
    lastActive: '3 hours ago'
  },
  {
    id: 'STAFF/HIET/111',
    staffId: 'STAFF/HIET/111',
    name: 'Officer Sunita Rathore',
    department: 'Auditorium & Events',
    desk: 'Lost Property Inspector (Seminar Hall & Auditorium)',
    email: 'staff111@hitech.ac.in',
    phone: 'Ext. 112',
    role: 'staff',
    status: 'Active',
    assignedIssues: 2,
    resolvedIssues: 17,
    activeCustodyItems: 6,
    joinedDate: '2023-11-20',
    lastActive: '40 mins ago'
  },
  {
    id: 'STAFF/HIET/112',
    staffId: 'STAFF/HIET/112',
    name: 'Officer Manoj Pandey',
    department: 'Mechanical Workshop',
    desk: 'Security Officer (Mechanical Block & Workshop)',
    email: 'staff112@hitech.ac.in',
    phone: 'Ext. 113',
    role: 'staff',
    status: 'Active',
    assignedIssues: 4,
    resolvedIssues: 13,
    activeCustodyItems: 2,
    joinedDate: '2023-12-01',
    lastActive: '1 hour ago'
  },
  {
    id: 'STAFF/HIET/113',
    staffId: 'STAFF/HIET/113',
    name: 'Officer Rekha Gupta',
    department: 'Central Library Floor 2',
    desk: 'Proctorial Assistant (Digital Library Wing)',
    email: 'staff113@hitech.ac.in',
    phone: 'Ext. 114',
    role: 'staff',
    status: 'Active',
    assignedIssues: 2,
    resolvedIssues: 15,
    activeCustodyItems: 4,
    joinedDate: '2024-01-10',
    lastActive: '20 mins ago'
  },
  {
    id: 'STAFF/HIET/114',
    staffId: 'STAFF/HIET/114',
    name: 'Officer Dharmendra Tomar',
    department: 'North Gate Patrol',
    desk: 'Perimeter Security Incharge (North Gate)',
    email: 'staff114@hitech.ac.in',
    phone: 'Ext. 115',
    role: 'staff',
    status: 'Active',
    assignedIssues: 1,
    resolvedIssues: 20,
    activeCustodyItems: 3,
    joinedDate: '2024-02-15',
    lastActive: '2 hours ago'
  },
  {
    id: 'STAFF/HIET/115',
    staffId: 'STAFF/HIET/115',
    name: 'Officer Pooja Saxena',
    department: 'Central Safe & Vault',
    desk: 'High-Value Safe Custodian (Admin Safe Room 102)',
    email: 'staff115@hitech.ac.in',
    phone: 'Ext. 116',
    role: 'staff',
    status: 'Active',
    assignedIssues: 2,
    resolvedIssues: 31,
    activeCustodyItems: 11,
    joinedDate: '2024-03-01',
    lastActive: '10 mins ago'
  },
  {
    id: 'STAFF/HIET/116',
    staffId: 'STAFF/HIET/116',
    name: 'Officer Harish Chandra',
    department: 'Surveillance & CCTV',
    desk: 'Surveillance Officer (Campus Control Room)',
    email: 'staff116@hitech.ac.in',
    phone: 'Ext. 117',
    role: 'staff',
    status: 'Active',
    assignedIssues: 5,
    resolvedIssues: 26,
    activeCustodyItems: 1,
    joinedDate: '2024-03-20',
    lastActive: 'Just now'
  },
  {
    id: 'STAFF/HIET/117',
    staffId: 'STAFF/HIET/117',
    name: 'Officer Neha Bisht',
    department: 'Evening Shift Operations',
    desk: 'Evening Shift Custody Desk (Gate 1 Despatch)',
    email: 'staff117@hitech.ac.in',
    phone: 'Ext. 118',
    role: 'staff',
    status: 'Active',
    assignedIssues: 2,
    resolvedIssues: 9,
    activeCustodyItems: 4,
    joinedDate: '2024-04-05',
    lastActive: '50 mins ago'
  },
  {
    id: 'STAFF/HIET/118',
    staffId: 'STAFF/HIET/118',
    name: 'Officer Vinod Kumar',
    department: 'Night Security Cell',
    desk: 'Night Shift Supervisor (Campus Perimeter)',
    email: 'staff118@hitech.ac.in',
    phone: 'Ext. 119',
    role: 'staff',
    status: 'Active',
    assignedIssues: 1,
    resolvedIssues: 14,
    activeCustodyItems: 2,
    joinedDate: '2024-04-18',
    lastActive: '4 hours ago'
  },
  {
    id: 'STAFF/HIET/119',
    staffId: 'STAFF/HIET/119',
    name: 'Officer Anjali Srivastava',
    department: 'Student Grievance & Claims',
    desk: 'Proctorial Operations Officer (Student Welfare Cell)',
    email: 'staff119@hitech.ac.in',
    phone: 'Ext. 120',
    role: 'staff',
    status: 'Active',
    assignedIssues: 4,
    resolvedIssues: 23,
    activeCustodyItems: 5,
    joinedDate: '2024-05-02',
    lastActive: '5 mins ago'
  }
];

// MASTER ADMIN ACCOUNT SPECIFICATION
export const MASTER_ADMIN_ACCOUNT = {
  id: 'ADMIN/HIET/156',
  adminId: 'ADMIN/HIET/156',
  name: 'Dr. Arvind K. Swarup',
  title: 'Chief Proctor & Master Administrator',
  department: 'Proctorial Directorate & Master Administration',
  email: 'admin.hiet156@hitech.ac.in',
  role: 'admin',
  status: 'Active',
  phone: 'Ext. 001',
  superAdmin: true
};

// GENERATE 250 FICTIONAL STUDENT DIRECTORY RECORDS (FOR ROBUST DEMO SIMULATION)
const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Ritvik', 'Darsh',
  'Ananya', 'Diya', 'Gauri', 'Isha', 'Kavya', 'Khushi', 'Navya', 'Pooja', 'Rhea', 'Riya',
  'Saanvi', 'Tanvi', 'Vanya', 'Zoya', 'Aditi', 'Akshara', 'Bhavya', 'Chhavi', 'Deepika', 'Divya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Chauhan', 'Yadav', 'Rawat', 'Joshi', 'Malik',
  'Pandey', 'Saxena', 'Mishra', 'Chandra', 'Bisht', 'Srivastava', 'Tomar', 'Rathore', 'Tyagi', 'Bhatt'
];

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Management & MBA'
];

const ACADEMIC_YEARS = [
  '1st Year (1st Sem)',
  '1st Year (2nd Sem)',
  '2nd Year (3rd Sem)',
  '2nd Year (4th Sem)',
  '3rd Year (5th Sem)',
  '3rd Year (6th Sem)',
  '4th Year (7th Sem)',
  '4th Year (8th Sem)'
];

export const generateFictionalStudents = () => {
  const students = [];
  for (let i = 1; i <= 250; i++) {
    const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const year = ACADEMIC_YEARS[i % ACADEMIC_YEARS.length];
    const rollNo = `230132010${String(i).padStart(3, '0')}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@hitech.ac.in`;
    
    // Status distribution: ~96% Active, ~4% Suspended
    const status = i % 24 === 0 ? 'Suspended' : 'Active';
    const lostReports = (i * 3) % 4;
    const foundReports = (i * 2) % 3;
    const claims = (i * 5) % 3;

    students.push({
      id: `STU-HIET-${String(i).padStart(3, '0')}`,
      studentId: rollNo,
      name: `${fName} ${lName}`,
      email,
      department: dept,
      academicYear: year,
      status,
      lostReports,
      foundReports,
      claims,
      role: 'student',
      registeredAt: `2026-0${1 + (i % 9)}-${String(1 + (i % 27)).padStart(2, '0')}`
    });
  }
  return students;
};

export const FICTIONAL_STUDENTS = generateFictionalStudents();

// 20 EXTENDED CAMPUS ISSUES FOR DEMO SIMULATION
export const DEMO_CAMPUS_ISSUES = [
  {
    id: 'ISS-2026-081',
    title: 'Water cooler leaking in Block A 2nd floor corridor',
    category: 'Water Supply',
    location: 'Academic Block A — 2nd Floor Corridor',
    description: 'Fresh drinking water unit has developed a steady leak causing slippery conditions near Room 204.',
    reporterName: 'Aditya Sharma',
    reporterRoll: '230132010012',
    assignedStaffId: 'STAFF/HIET/104',
    assignedStaffName: 'Officer Vikram Rawat',
    priority: 'High',
    status: 'In Progress',
    upvotes: 38,
    createdAt: '2026-10-21 09:30',
    updatedAt: '2026-10-23 11:20',
    resolutionNotes: 'Plumber dispatched. Main valve temporarily diverted.'
  },
  {
    id: 'ISS-2026-082',
    title: 'Central Library projector flickering during lectures',
    category: 'Classroom Equipment',
    location: 'Central Library — Audio Visual Hall',
    description: 'HDMI display port drops signal every 5 minutes during multimedia presentations.',
    reporterName: 'Ananya Gupta',
    reporterRoll: '230132010045',
    assignedStaffId: 'STAFF/HIET/102',
    assignedStaffName: 'Officer Amit Singh',
    priority: 'Medium',
    status: 'Submitted',
    upvotes: 19,
    createdAt: '2026-10-22 14:15',
    updatedAt: '2026-10-22 14:15',
    resolutionNotes: null
  },
  {
    id: 'ISS-2026-083',
    title: 'Tube light broken in Computer Lab 3',
    category: 'Electricity',
    location: 'Computer Lab 3 — Block B',
    description: 'Three overhead fluorescent lamps on row 4 are flickering continuously causing eye strain.',
    reporterName: 'Reyansh Verma',
    reporterRoll: '230132010078',
    assignedStaffId: 'STAFF/HIET/107',
    assignedStaffName: 'Officer Deepa Malik',
    priority: 'Low',
    status: 'Resolved',
    upvotes: 24,
    createdAt: '2026-10-18 10:00',
    updatedAt: '2026-10-19 16:30',
    resolutionNotes: 'Replaced with 3 new LED tube batten fixtures by campus electrician.'
  },
  {
    id: 'ISS-2026-084',
    title: 'Main cafeteria trash bin overflowing during lunch hours',
    category: 'Cleanliness',
    location: 'Central Campus Canteen',
    description: 'Disposal bin near the food court wash area gets clogged between 1 PM and 2 PM daily.',
    reporterName: 'Saanvi Singh',
    reporterRoll: '230132010099',
    assignedStaffId: 'STAFF/HIET/108',
    assignedStaffName: 'Officer Anil Kumar',
    priority: 'Medium',
    status: 'In Progress',
    upvotes: 45,
    createdAt: '2026-10-20 13:40',
    updatedAt: '2026-10-22 10:00',
    resolutionNotes: 'Housekeeping supervisor instructed to add two 120L mobile bins.'
  },
  {
    id: 'ISS-2026-085',
    title: 'Wi-Fi Access Point offline near Mechanical Seminar Room',
    category: 'Internet',
    location: 'Mechanical Engineering Block — 1st Floor',
    description: 'Students unable to connect to HIET-STUDENT network in the common corridor.',
    reporterName: 'Vivaan Joshi',
    reporterRoll: '230132010114',
    assignedStaffId: 'STAFF/HIET/112',
    assignedStaffName: 'Officer Manoj Pandey',
    priority: 'High',
    status: 'Resolved',
    upvotes: 52,
    createdAt: '2026-10-17 11:20',
    updatedAt: '2026-10-18 14:10',
    resolutionNotes: 'IT cell rebooted PoE switch and replaced damaged RJ45 connector.'
  },
  {
    id: 'ISS-2026-086',
    title: 'Broken desk chair with exposed metal edge in Hall 104',
    category: 'Furniture',
    location: 'Lecture Hall 104 — Block A',
    description: 'Bench 7 right armrest has cracked plastic and sharp edge requiring replacement.',
    reporterName: 'Diya Chauhan',
    reporterRoll: '230132010134',
    assignedStaffId: 'STAFF/HIET/104',
    assignedStaffName: 'Officer Vikram Rawat',
    priority: 'Medium',
    status: 'Resolved',
    upvotes: 14,
    createdAt: '2026-10-15 15:30',
    updatedAt: '2026-10-16 12:00',
    resolutionNotes: 'Defective chair removed to workshop; replacement dual-desk installed.'
  },
  {
    id: 'ISS-2026-087',
    title: 'Exhaust fan failure in Girls Hostel 2 ground floor washroom',
    category: 'Cleanliness',
    location: 'Girls Hostel 2 — Ground Floor',
    description: 'Ventilation unit stopped spinning; creating moisture buildup in the morning.',
    reporterName: 'Tanvi Malik',
    reporterRoll: '230132010156',
    assignedStaffId: 'STAFF/HIET/103',
    assignedStaffName: 'Officer Priya Chauhan',
    priority: 'Critical',
    status: 'In Progress',
    upvotes: 61,
    createdAt: '2026-10-22 08:10',
    updatedAt: '2026-10-23 09:40',
    resolutionNotes: 'Motor replacement ordered; temporary ventilation fan installed.'
  },
  {
    id: 'ISS-2026-088',
    title: 'Gate 2 security boom barrier sensor delay',
    category: 'Other',
    location: 'Vehicle Entry Gate 2',
    description: 'RFID reader requires student two-wheelers to wait 15-20 seconds during peak morning entry.',
    reporterName: 'Kabir Saxena',
    reporterRoll: '230132010178',
    assignedStaffId: 'STAFF/HIET/106',
    assignedStaffName: 'Officer Rakesh Yadav',
    priority: 'Low',
    status: 'Submitted',
    upvotes: 27,
    createdAt: '2026-10-23 08:45',
    updatedAt: '2026-10-23 08:45',
    resolutionNotes: null
  }
];

// RECENT AUDIT ACTIVITY TIMELINE
export const DEMO_AUDIT_LOGS = [
  {
    id: 'LOG-9401',
    type: 'claim_approved',
    title: 'Claim Approved by Officer Rajesh Verma',
    description: 'Approved ownership claim #CLM-1038 for Boat Airdopes after student provided matching serial photo.',
    timestamp: '15 mins ago',
    actor: 'STAFF/HIET/100 (Officer Rajesh Verma)',
    badge: 'Claim Approved',
    badgeColor: 'emerald'
  },
  {
    id: 'LOG-9402',
    type: 'issue_assigned',
    title: 'Campus Issue Assigned to Officer Vikram Rawat',
    description: 'Issue #ISS-2026-081 (Water cooler leak) marked as In Progress with High Priority.',
    timestamp: '42 mins ago',
    actor: 'ADMIN/HIET/156 (Dr. Arvind K. Swarup)',
    badge: 'Assignment',
    badgeColor: 'blue'
  },
  {
    id: 'LOG-9403',
    type: 'item_deposited',
    title: 'Found Item Deposited at Main Gate 1',
    description: 'Official College ID card turned in by student; deposited into Safe Locker #14.',
    timestamp: '1 hour ago',
    actor: 'STAFF/HIET/101 (Officer Suresh Sharma)',
    badge: 'Custody Log',
    badgeColor: 'amber'
  },
  {
    id: 'LOG-9404',
    type: 'student_registered',
    title: 'New Student Account Verified',
    description: 'Student Rahul Sharma (Roll: 230132010099, CSE 2nd Year) created verified account.',
    timestamp: '2 hours ago',
    actor: 'System Auto-Provision',
    badge: 'Registration',
    badgeColor: 'purple'
  },
  {
    id: 'LOG-9405',
    type: 'duplicate_resolved',
    title: 'Duplicate Report Flagged & Merged',
    description: 'Report #CF-LST-1031 merged into primary report #CF-LST-1028 to prevent duplicate notifications.',
    timestamp: '3 hours ago',
    actor: 'STAFF/HIET/107 (Officer Deepa Malik)',
    badge: 'Duplicate Match',
    badgeColor: 'indigo'
  },
  {
    id: 'LOG-9406',
    type: 'issue_resolved',
    title: 'Facility Issue #ISS-2026-085 Marked Resolved',
    description: 'Wi-Fi Access Point online in Mechanical block. Resolution notes logged.',
    timestamp: '4 hours ago',
    actor: 'STAFF/HIET/112 (Officer Manoj Pandey)',
    badge: 'Issue Resolved',
    badgeColor: 'emerald'
  }
];

// ANALYTICS TIME-SERIES DATA FOR CHARTS
export const ANALYTICS_TREND_DATA = {
  '7d': [
    { date: 'Oct 17', lost: 4, found: 6, issues: 3, resolved: 2 },
    { date: 'Oct 18', lost: 7, found: 5, issues: 5, resolved: 4 },
    { date: 'Oct 19', lost: 5, found: 8, issues: 4, resolved: 3 },
    { date: 'Oct 20', lost: 8, found: 9, issues: 6, resolved: 5 },
    { date: 'Oct 21', lost: 6, found: 7, issues: 4, resolved: 3 },
    { date: 'Oct 22', lost: 9, found: 11, issues: 7, resolved: 6 },
    { date: 'Oct 23', lost: 11, found: 14, issues: 8, resolved: 7 }
  ],
  '30d': [
    { date: 'Week 1', lost: 24, found: 31, issues: 18, resolved: 14 },
    { date: 'Week 2', lost: 32, found: 38, issues: 24, resolved: 20 },
    { date: 'Week 3', lost: 28, found: 35, issues: 21, resolved: 19 },
    { date: 'Week 4', lost: 39, found: 46, issues: 29, resolved: 25 }
  ],
  '90d': [
    { date: 'August', lost: 85, found: 104, issues: 62, resolved: 54 },
    { date: 'September', lost: 112, found: 128, issues: 78, resolved: 71 },
    { date: 'October', lost: 123, found: 150, issues: 92, resolved: 81 }
  ],
  'all': [
    { date: 'Semester 1', lost: 180, found: 210, issues: 140, resolved: 125 },
    { date: 'Semester 2', lost: 240, found: 280, issues: 190, resolved: 172 },
    { date: 'Semester 3', lost: 320, found: 382, issues: 232, resolved: 206 }
  ]
};

// CATEGORY BREAKDOWN FOR CAMPUS ISSUES
export const ISSUES_CATEGORY_BREAKDOWN = [
  { category: 'Cleanliness', count: 34, percentage: 24, color: '#f97316' },
  { category: 'Electricity', count: 28, percentage: 20, color: '#eab308' },
  { category: 'Water Supply', count: 24, percentage: 17, color: '#3b82f6' },
  { category: 'Classroom Equipment', count: 21, percentage: 15, color: '#8b5cf6' },
  { category: 'Internet & Wi-Fi', count: 18, percentage: 13, color: '#10b981' },
  { category: 'Furniture', count: 11, percentage: 8, color: '#64748b' },
  { category: 'Other Campus Facilities', count: 5, percentage: 3, color: '#ec4899' }
];
