# CampusFind — Lost on Campus. Found Together.
### Official Lost-and-Found Recovery Portal for Hi-Tech Institute of Engineering, Ghaziabad

CampusFind is a modern, responsive frontend web application built for college campuses to streamline reporting, cataloging, discovering, and reclaiming lost possessions with verified ownership safeguards.

Designed and styled strictly following the **Project 2025 Institutional University UI/UX reference mockup (by designmonks)**.

---

## 🎨 Design & Visual Architecture (Reference Image Alignment)

1. **Two-Tier Institutional Navigation**:
   - **Top Tier**:
     - CampusFind stylized open-book academic emblem + institution title (`HI-TECH INSTITUTE OF ENGINEERING, GHAZIABAD`).
     - Utility links: `Directory`, `Campus Desks`, `Protocol`.
     - `Staff 🔒` lock pill: instant toggle for campus security and proctorial desk.
     - Role Selector pill: `Current Student ∨` / `Security Staff` with instant role switching.
     - Global search input bar with search-as-you-type capability.
     - Royal Cobalt Blue high-contrast CTA button: **`Log in ↗`** docked at the top right.
   - **Sub-Nav Tier**:
     - Category and module links with down chevrons (`Browse Items ∨`, `Report Lost Item`, `Report Found Item`, `My Dashboard ∨`, `Admin Desk`).
     - Active indicator pill and quick lost/found action shortcuts.

2. **Reference-Faithful Hero Section**:
   - Academic ivory canvas (`#fbfbfa`) with subtle geometric lattice watermark pattern.
   - Sage teal pre-header badge: `Lost on Campus. Found Together.`
   - Impactful bold display typography: *"Lost Something on Campus? Let's Find It."*
   - **2x2 Quick Action Cards Grid** (direct replication of reference layout):
     - **Card 1 (Top-Left)**: Vibrant terracotta / warm orange (`#ea580c`) active CTA card: **`Report Lost Item ↗`**.
     - **Card 2 (Top-Right)**: Crisp white card: **`Report Found Item`**.
     - **Card 3 (Bottom-Left)**: Crisp white card: **`Browse Directory`**.
     - **Card 4 (Bottom-Right)**: Crisp white card: **`Claim & Recover`**.
   - Pinned location tag at bottom-left: `📍 Hi-Tech Institute of Engineering, NH-24, Ghaziabad, Uttar Pradesh, India`.
   - Architectural campus colonnade visual with carousel pagination slider dots (`────── ••••••`).

3. **Color Palette**:
   - **Canvas / Background**: Warm off-white / ivory (`#fbfbfa` / `#ffffff`).
   - **Primary Text**: Deep slate / charcoal (`#0f172a`, `#1e293b`).
   - **Hero Highlight Accent**: Warm Terracotta / Burnt Orange (`#ea580c`).
   - **Primary Button Accent**: Royal Cobalt Blue (`#3b5bf5`).
   - **Success / Found Accent**: Emerald Green (`#059669`).
   - **Lost / Alert Accent**: Rose Coral (`#e11d48`).
   - **Borders & Dividers**: Hairline stone (`#e5e7eb` / `#e7e5e4`).

---

## 💻 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **State Management**: React Context (`AppContext`) with `localStorage` session persistence
- **Typography**: Plus Jakarta Sans & Space Grotesk

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Launch

1. Open PowerShell / Terminal in the project directory:
   ```powershell
   cd c:\Users\HP\Downloads\Antigravity
   ```

2. Install dependencies:
   ```powershell
   npm.cmd install
   ```

3. Launch development server:
   ```powershell
   npm.cmd run dev
   ```

4. Open your browser at:
   ```
   http://127.0.0.1:5173/
   ```

5. To generate a production build:
   ```powershell
   npm.cmd run build
   ```

---

## 📱 Complete Pages & Interactive Features

### 1. Home Page (`/`)
- Two-tier university navbar with role switcher and live search.
- Signature 2x2 Hero action cards, architectural carousel, and campus location badge.
- Instant search bar with popular tag shortcuts (`Boat Airdopes`, `ID Card`, `Dell Charger`, etc.).
- Live campus recovery metrics banner (Active Lost, Found in Custody, Reunited, 92.4% success rate).
- Recently reported items feed with instant filter tabs (`All`, `Lost Only`, `Found Only`).
- 3-Step "How It Works" protocol (Report -> Match -> Recover).
- Campus Security Desks overview (Gate 1, Central Library, Proctor Office, Sports Complex).
- Anti-fraud trust & verification guarantees (Zero-Dox privacy policy).

### 2. Browse Items Page (`/browse`)
- Real-time search query across titles, descriptions, locations, and reference IDs.
- Type filters: All, Lost Reports, Found Belongings, Recovered.
- Category dropdown (Electronics, ID & Documents, Keys, Backpacks, Bottles, Books, etc.).
- Campus location dropdown (Central Library, Canteen, Block A, Workshop, etc.).
- Sorting (Newest First, Oldest First, Alphabetical A-Z).
- Grid View and List View switcher.
- Responsive item cards with status badges and "View Details" trigger.
- Clean empty state with "Reset All Filters" button.

### 3. Report Lost Item Page (`/report-lost`)
- Item title, category selector, detailed description.
- Last-seen campus location and loss date / time.
- Private distinguishing marks (confidential proof field for verification).
- Image file upload with real browser preview and sample presets.
- Frontend validation, required field indicators, and error feedback.
- Generates dynamic reference ticket (`CF-LST-XXXX`) and adds it into the live session.

### 4. Report Found Item Page (`/report-found`)
- Found item title, category, visual description.
- Discovered location, date & time.
- Custody drop-off selector (Gate 1 Security Desk, Library Counter, Proctor Office).
- Concealed verification question (to challenge fraudulent claimants).
- Photo upload with live preview.
- Generates ticket (`CF-FND-XXXX`) and registers into found inventory.

### 5. Item Details Modal
- Full high-resolution photo with status badge and category badge.
- Description, identifying hints, and current physical custody desk.
- Sighting submission form for lost items.
- "Claim This Item" trigger for found items.
- Copy reference ID action.

### 6. Claim Item Modal
- Item summary card.
- Claimant Full Name and College Roll Number.
- Official institutional email.
- Proof of ownership description (screen lock, serial number, internal contents).
- Answer to secret verification challenge.
- Supporting evidence photo upload preview.
- Disciplinary honor code agreement checkbox.
- Submits claim (`CLM-XXXX`) and changes item status to `claimed`!

### 7. User Dashboard (`/dashboard`)
- Student profile banner (Aarav Sharma, Roll: 220132010045, CSE 3rd Year).
- Profile metrics: Lost reports, items found, claims submitted, recovered items.
- Tabbed views:
  - **My Lost Items**: View, mark as recovered, or withdraw report.
  - **My Found Items**: Track custody and reports.
  - **Submitted Claims**: Track security review status (`pending`, `approved`, `rejected`) and read admin notes.

### 8. Admin Desk (`/admin`)
- Campus security portal for Officer Rajesh Verma (Gate 1 Incharge).
- 4 real-time metric cards: Lost Reports, Custody Items, Pending Claims, Recovered Possessions.
- **Claims Review Desk**:
  - Inspect claimant details, student roll number, and submitted evidence.
  - One-click **"Approve & Release"** button: marks claim approved and item status as `recovered`!
  - One-click **"Reject Claim"** button with customizable admin feedback note.
- **Inventory Master Table**: Complete searchable catalog with quick status updates.
- "Reset Mock Data" button to restore default demo state.

### 9. Authentication Page (`/login`)
- Dual-mode tabs: Sign In / Register.
- Role selector: Student / Faculty / Staff.
- Password visibility toggle.
- One-click demo credential presets:
  - "Demo Student: Aarav Sharma"
  - "Security Admin: Officer R. Verma"

---

## 🔌 Future Backend & Supabase Integration Roadmap

All mock state in `src/data/mockData.js` and `src/context/AppContext.jsx` is strictly decoupled from UI components. When ready to add Supabase:

1. **Database Tables**:
   - `items`: id, type, title, category, description, location, date, time, status, image_url, reporter_id, identifying_marks, custody_location, verification_question.
   - `claims`: id, item_id, claimant_id, proof_description, evidence_image_url, status, admin_notes, created_at.
   - `profiles`: id, full_name, roll_no, role, department, email, avatar_url.
2. **Storage Bucket**:
   - `item-photos`: secure upload bucket for photos and claim receipts.
3. **Row-Level Security (RLS)**:
   - Public read for active lost/found items.
   - Private read for `identifying_marks` (only reporter and admins).
   - Only admins can update claim status to `approved` / `rejected`.
4. **Auth**:
   - Supabase Auth with Google OAuth or `@hitech.ac.in` domain restriction.
