# Future_FS_02 — ClientFlow CRM

A full-stack Client Lead Management System developed as part of the **Future Interns Full Stack Web Development Internship — Task 2**.

ClientFlow is a mini CRM that helps administrators manage client leads, track their status, add follow-up notes, and monitor lead conversion activity through a clean dashboard.

---

## 🚀 Features

### 🔐 Admin Authentication
- Secure admin login
- JWT-based authentication
- Protected lead management APIs
- Automatic logout when authentication expires

### 👥 Lead Management
- Add new leads
- View lead details
- Update lead information
- Delete leads
- Track lead source
- Track company and contact information

### 📊 Lead Status Tracking
Leads can move through the following pipeline:

**New → Contacted → Converted**

The dashboard automatically updates the lead statistics based on the current status.

### 📝 Follow-up Notes
- Add notes to individual leads
- Store notes in MongoDB
- Track when each note was created
- View previous follow-up activity

### 🔎 Search & Filtering
- Search leads by name, email, company, or other lead information
- Filter leads by status
- Quickly find specific leads

### 📈 Analytics Dashboard
- Total leads
- New leads
- Contacted leads
- Converted leads
- Lead status distribution
- Conversion rate

### ⚙️ Admin Settings
- View administrator information
- View workspace information
- Logout securely

### 📱 Responsive Interface
- Responsive dashboard layout
- Mobile-friendly design
- Clean SaaS-style interface
- Modern cards, tables, forms, and navigation

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS

### Development Tools
- Git
- GitHub
- Postman
- VS Code

---

## 📂 Project Structure

```text
Future_FS_02/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   └── Lead.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── leadRoutes.js
│   │
│   ├── .env
│   ├── createAdmin.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/AnushaVShet/Future_FS_02.git
2. Navigate to the backend
cd Future_FS_02/backend
3. Install dependencies
npm install
4. Configure environment variables

Create a .env file inside the backend folder:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Do not commit the .env file to GitHub.

5. Start the backend
node server.js

The API will run on:

http://localhost:5000
6. Start the frontend

Open the frontend folder using VS Code Live Server.

The application will open in your browser.

🔑 Admin Login

The application uses JWT-based administrator authentication.

For local development, an administrator account can be created using:

node createAdmin.js

Use the administrator credentials created during setup to log into the dashboard.

For security, never publish real passwords, JWT secrets, or MongoDB credentials in the repository.

🔌 API Overview
Authentication
POST /api/auth/login

Used for administrator login and JWT token generation.

Leads
GET    /api/leads
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
POST   /api/leads/:id/notes

Lead management routes are protected using JWT authentication.

📊 Lead Workflow
New
 ↓
Contacted
 ↓
Converted

Administrators can update a lead's status as the lead progresses through the client pipeline.

🎯 Project Objective

The objective of this project is to demonstrate a complete full-stack workflow involving:

Frontend development
REST API development
Database integration
Authentication
CRUD operations
Search and filtering
Analytics
Responsive UI design

The project follows a practical CRM workflow where lead information is collected, managed, followed up, and converted.

👩‍💻 Developed By

Anusha V Shet

Information Science Engineering Student

GitHub:
https://github.com/AnushaVShet

📌 Internship

Future Interns — Full Stack Web Development Internship

Task 2 — Client Lead Management System

Repository: Future_FS_02

