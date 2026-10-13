// Mock Data for CampusFind - Hi-Tech Institute of Engineering, Ghaziabad

export const CAMPUS_LOCATIONS = [
  'All Campus Locations',
  'Central Library (2nd Floor)',
  'Campus Canteen & Nescafe Stall',
  'Computer Science Lab 4 (Block A)',
  'Lecture Hall 102 (Block B)',
  'Mechanical Engineering Workshop',
  'Sports Complex & Badminton Court',
  'Admin Block Reception & Security Desk',
  'Auditorium & Seminar Hall',
  'Bus Parking Area (Gate 2)',
  'Boys Hostel 1 Common Room',
  'Girls Hostel Reception'
];

export const ITEM_CATEGORIES = [
  'All Categories',
  'Electronics & Gadgets',
  'College ID & Documents',
  'Keys & Keychains',
  'Bags & Backpacks',
  'Bottles & Tumblers',
  'Books & Stationery',
  'Wearables & Watches',
  'Wallets & Cards',
  'Eyewear & Accessories'
];

export const INITIAL_ITEMS = [
  {
    id: 'CF-LST-101',
    type: 'lost', // 'lost' | 'found'
    title: 'Boat Airdopes 141 (Black Case)',
    category: 'Electronics & Gadgets',
    description: 'Black charging case with a reflective Batman logo sticker on top. Left earbud has slight scratch near the stem. Battery was at around 40%.',
    location: 'Central Library (2nd Floor)',
    date: '2026-10-10',
    time: '03:30 PM',
    status: 'lost', // 'lost' | 'found' | 'claimed' | 'recovered'
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Zaid Saifee',
    reporterRole: 'Student (3rd Year CSE)',
    reporterRoll: '220132010045',
    identifyingMarks: 'Batman sticker on front, left earbud serial ending in 49B.',
    custodyLocation: 'N/A (Still Lost)',
    claimCount: 0
  },
  {
    id: 'CF-FND-102',
    type: 'found',
    title: 'College ID Card & Library Card',
    category: 'College ID & Documents',
    description: 'Official Hi-Tech Institute student smart card with blue lanyard. Found on wooden bench near the coffee vending machine.',
    location: 'Campus Canteen & Nescafe Stall',
    date: '2026-10-11',
    time: '11:15 AM',
    status: 'found',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Security Desk Officer Verma',
    reporterRole: 'Campus Security',
    reporterRoll: 'STAFF-SEC-09',
    identifyingMarks: 'Student Name: Priyanshu Saxena, Roll: 230132010112, IT Dept.',
    custodyLocation: 'Main Security Gate 1 Desk',
    verificationQuestion: 'What is the branch and admission year printed on the reverse?',
    claimCount: 1
  },
  {
    id: 'CF-FND-103',
    type: 'found',
    title: 'Casio FX-991EX ClassWiz Calculator',
    category: 'Electronics & Gadgets',
    description: 'White and black scientific calculator with cover sliding case. Has a small handwritten formula sticker inside the protective slide lid.',
    location: 'Lecture Hall 102 (Block B)',
    date: '2026-10-12',
    time: '01:45 PM',
    status: 'found',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Dr. Meenakshi Sundaram',
    reporterRole: 'Assistant Professor, Mathematics',
    reporterRoll: 'FAC-MATH-204',
    identifyingMarks: 'Initials "R.K." engraved lightly on the battery cover.',
    custodyLocation: 'Block B Department Office (Room 205)',
    verificationQuestion: 'What initials or formula note is inside the cover lid?',
    claimCount: 0
  },
  {
    id: 'CF-LST-104',
    type: 'lost',
    title: 'Wildcraft Grey Laptop Backpack',
    category: 'Bags & Backpacks',
    description: '35L Grey weather-resistant bag with black zippers. Contains Engineering Drawing cylinder tube attached to side buckle and rough notes.',
    location: 'Computer Science Lab 4 (Block A)',
    date: '2026-10-11',
    time: '04:50 PM',
    status: 'lost',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Rohan Mehta',
    reporterRole: 'Student (2nd Year ME)',
    reporterRoll: '230132040019',
    identifyingMarks: 'Keychain with mini metallic wrench attached to bottom zip.',
    custodyLocation: 'N/A',
    claimCount: 0
  },
  {
    id: 'CF-FND-105',
    type: 'found',
    title: 'Set of 3 Bike Keys with Leather Strap',
    category: 'Keys & Keychains',
    description: 'Two ignition keys and one disc lock key with a vintage tan leather Royal Enfield keychain strap.',
    location: 'Bus Parking Area (Gate 2)',
    date: '2026-10-12',
    time: '09:30 AM',
    status: 'found',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Sunil Kumar (Guard)',
    reporterRole: 'Parking Supervisor',
    reporterRoll: 'STAFF-PRK-03',
    identifyingMarks: 'Small brass tag with number 74 engraved.',
    custodyLocation: 'Admin Block Central Security Desk',
    verificationQuestion: 'What motorcycle brand logo is stamped on the leather strap?',
    claimCount: 0
  },
  {
    id: 'CF-LST-106',
    type: 'lost',
    title: 'Milton Thermosteel Water Bottle (750ml, Blue)',
    category: 'Bottles & Tumblers',
    description: 'Navy blue matte finish insulated bottle with silver cap ring. Has a minor dent at the bottom rim.',
    location: 'Sports Complex & Badminton Court',
    date: '2026-10-09',
    time: '05:15 PM',
    status: 'lost',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Ananya Gupta',
    reporterRole: 'Student (4th Year ECE)',
    reporterRoll: '210132030012',
    identifyingMarks: 'Yellow smiley sticker peeling slightly on the upper neck.',
    custodyLocation: 'N/A',
    claimCount: 0
  },
  {
    id: 'CF-FND-107',
    type: 'found',
    title: 'Dell G-Series 130W Laptop Charger',
    category: 'Electronics & Gadgets',
    description: 'Black AC power brick with 3-pin Indian plug and blue LED indicator ring on the barrel pin connector.',
    location: 'Central Library (2nd Floor)',
    date: '2026-10-10',
    time: '06:00 PM',
    status: 'claimed', // currently in claim review
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Library Staff Desk',
    reporterRole: 'Librarian Assistant',
    reporterRoll: 'STAFF-LIB-02',
    identifyingMarks: 'Serial barcode ends with CN-0VT49.',
    custodyLocation: 'Library Ground Floor Circulation Counter',
    verificationQuestion: 'What watt rating and pin shape does this charger use?',
    claimCount: 2
  },
  {
    id: 'CF-LST-108',
    type: 'lost',
    title: 'Titan Eyeplus Spectacles (Black Matte Frame)',
    category: 'Eyewear & Accessories',
    description: 'Rectangular black matte frame with blue-light filter lenses in a magnetic grey Titan hard case.',
    location: 'Lecture Hall 102 (Block B)',
    date: '2026-10-08',
    time: '02:00 PM',
    status: 'recovered', // successfully recovered
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    reporterName: 'Vikram Singh',
    reporterRole: 'Student (1st Year Civil)',
    reporterRoll: '240132000034',
    identifyingMarks: 'Right temple has model number TH-5021.',
    custodyLocation: 'Returned to Owner on 10 Oct',
    claimCount: 1
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'CLM-8821',
    itemId: 'CF-FND-102',
    itemTitle: 'College ID Card & Library Card',
    claimantName: 'Priyanshu Saxena',
    claimantRoll: '230132010112',
    claimantEmail: 'priyanshu.23it@hitech.ac.in',
    proofDescription: 'This is my college ID card. My roll number 230132010112 is on it and my photo is on the front side. I dropped it near the Nescafe stall right after my 11 AM class.',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    submittedAt: '2026-10-11 12:40 PM',
    adminNotes: 'Student verified matching roll number on ERP portal. Pending physical identity check at gate.'
  },
  {
    id: 'CLM-8822',
    itemId: 'CF-FND-107',
    itemTitle: 'Dell G-Series 130W Laptop Charger',
    claimantName: 'Karan Joshi',
    claimantRoll: '220132010088',
    claimantEmail: 'karan.j@hitech.ac.in',
    proofDescription: 'I left my 130W Dell barrel pin charger on table 14 of the library reading room. It has a tiny slice of white electrical tape near the barrel connector.',
    status: 'pending',
    submittedAt: '2026-10-11 09:15 AM',
    adminNotes: 'Awaiting inspection of barrel connector electrical tape detail.'
  }
];

export const DEMO_USERS = {
  student: {
    name: 'Zaid Saifee',
    role: 'Student',
    department: 'Computer Science & Engineering',
    semester: '5th Semester (3rd Year)',
    rollNo: '220132010045',
    email: 'zaid.saifee@hitech.ac.in',
    phone: '+91 98712 34567',
    avatar: '/zaid-saifee.png',
    itemsReported: 2,
    claimsSubmitted: 1
  },
  admin: {
    name: 'Officer Rajesh Verma',
    role: 'Campus Security Incharge',
    department: 'Proctorial & Security Wing',
    semester: 'Administration',
    rollNo: 'STAFF-SEC-01',
    email: 'security.desk@hitech.ac.in',
    phone: '+91 98110 54321',
    avatar: '/zaid-saifee.png',
    itemsReported: 1,
    claimsSubmitted: 0
  }
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Potential Match Found!',
    message: 'An item matching your reported "Boat Airdopes 141" was submitted at the Central Library Desk.',
    time: '10 minutes ago',
    read: false,
    type: 'match'
  },
  {
    id: 'notif-2',
    title: 'Claim Under Review',
    message: 'Your claim request #CLM-8821 for Student ID Card is actively being verified by Gate 1 Security.',
    time: '45 minutes ago',
    read: false,
    type: 'claim'
  },
  {
    id: 'notif-3',
    title: 'Custody Handover Registered',
    message: 'Casio FX-991EX Calculator deposited by Dr. Sundaram in Room 205 (Block B).',
    time: '2 hours ago',
    read: false,
    type: 'custody'
  },
  {
    id: 'notif-4',
    title: 'New Found Item Near Canteen',
    message: 'A set of 3 bike keys with Royal Enfield leather strap was turned into Gate 1 Reception.',
    time: '4 hours ago',
    read: false,
    type: 'match'
  },
  {
    id: 'notif-5',
    title: 'Sighting Reported by Student',
    message: 'A peer reported spotting a grey Wildcraft bag in Computer Lab 4 near terminal 18.',
    time: 'Yesterday, 04:15 PM',
    read: false,
    type: 'sighting'
  },
  {
    id: 'notif-6',
    title: 'Claim Approved & Reunited',
    message: 'Titan Eyeplus Spectacles have been successfully returned to student owner Vikram Singh.',
    time: 'Yesterday, 02:00 PM',
    read: true,
    type: 'success'
  },
  {
    id: 'notif-7',
    title: 'Notice from Proctor Desk',
    message: 'Weekly physical inventory audit of all lockers will be held this Friday in Admin Block Room 10.',
    time: '2 days ago',
    read: true,
    type: 'system'
  },
  {
    id: 'notif-8',
    title: 'Sports Complex Deposit',
    message: 'Blue Milton Thermosteel Bottle kept safely at Badminton Reception counter.',
    time: '3 days ago',
    read: true,
    type: 'custody'
  },
  {
    id: 'notif-9',
    title: 'Security Desk Advisory',
    message: 'Intercom hotline active 24/7 at Gate 1 (Ext. 101) for reporting night-time misplaced belongings.',
    time: '4 days ago',
    read: true,
    type: 'system'
  }
];

export const CAMPUS_SECURITY_HUBS = [
  {
    name: 'Main Gate 1 Security Desk',
    location: 'Gate 1, NH-24 Campus Entrance',
    hours: '24/7 Service',
    officer: 'Sub-Inspector R. Verma',
    incharge: 'Gate Security & Vehicle Logs',
    phone: 'Ext. 101'
  },
  {
    name: 'Central Library Help Desk',
    location: 'Ground Floor, Circulation Desk',
    hours: '08:30 AM – 08:00 PM',
    officer: 'Mr. S. P. Tripathi',
    incharge: 'Books, Gadgets & Study Materials',
    phone: 'Ext. 204'
  },
  {
    name: 'Student Welfare & Proctor Office',
    location: 'Admin Block, Ground Floor, Room 12',
    hours: '09:00 AM – 05:00 PM',
    officer: 'Prof. Anjali Saxena',
    incharge: 'High-Value Items & Identity Cards',
    phone: 'Ext. 310'
  },
  {
    name: 'Sports Complex Equipment Counter',
    location: 'Indoor Badminton Hall Reception',
    hours: '06:00 AM – 07:30 PM',
    officer: 'Coach Virender Singh',
    incharge: 'Sports Gear, Bottles & Apparel',
    phone: 'Ext. 405'
  }
];
