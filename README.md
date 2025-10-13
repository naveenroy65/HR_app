# Complete HR Management System

A comprehensive Human Resources Management System built with React, TypeScript, Node.js, Express, and MongoDB. This full-stack application manages employees, departments, attendance, leave requests, payroll, and generates reports with multi-factor authentication.

![HR Management System](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)

## 🌟 Features

### Frontend
- **Modern UI/UX**: Built with React 19 and TypeScript
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live attendance tracking and notifications
- **Role-based Access**: Different views for Admin, HR, Manager, and Employee
- **Multi-factor Authentication**: TOTP-based 2FA for enhanced security

### Backend
- **RESTful API**: Complete API with Express.js
- **MongoDB Database**: Scalable NoSQL database
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Fine-grained access control
- **Automated Payroll**: Calculate salaries with deductions

### Key Modules

#### 👥 Employee Management
- Add, edit, and remove employees
- Employee profiles with avatars
- Department assignments
- Employment status tracking
- Grid and list view modes

#### 🏢 Department Management
- Create and manage departments
- Assign department managers
- View department statistics

#### ⏰ Attendance Tracking
- Clock in/out functionality
- Attendance history and calendar
- Weekly work hours tracking
- Automated attendance reports

#### 🏖️ Leave Management
- Submit leave requests
- Approve/reject leave requests
- Leave balance tracking (Annual, Sick, Casual, Unpaid)
- Leave history and pending requests

#### 💰 Payroll System
- Automated payroll generation
- Salary breakdowns (Basic, HRA, Special Allowance)
- Deductions (Tax, PF, Absences)
- Downloadable payslips
- Mark payroll as paid

#### 📊 Reports & Analytics
- Employee reports
- Attendance analytics
- Leave statistics
- Payroll summaries
- Department distribution charts

#### 🔔 Notifications
- Real-time notifications
- Leave request updates
- Payroll notifications
- System announcements

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd workspace
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
```

4. **Setup environment variables**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. **Start MongoDB**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
net start MongoDB
```

6. **Seed the database**
```bash
cd server
npm run seed
```

7. **Start the backend server**
```bash
cd server
npm run dev
```

8. **Start the frontend** (in a new terminal)
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🔐 Default Test Accounts

After seeding the database, use these credentials:

| Role     | Email               | Password     |
|----------|---------------------|--------------|
| Admin    | admin@hrms.com      | password123  |
| HR       | hr@hrms.com         | password123  |
| Manager  | manager@hrms.com    | password123  |
| Employee | employee@hrms.com   | password123  |

**Note**: MFA is disabled by default for testing. You can set it up on first login.

## 📁 Project Structure

```
workspace/
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── dashboard/       # Dashboard widgets
│   ├── departments/     # Department components
│   ├── employees/       # Employee components
│   ├── layout/          # Layout components
│   ├── leave/           # Leave management
│   ├── mfa/             # MFA setup/verification
│   └── pages/           # Page components
├── data/                # Mock data (for development)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── server/              # Backend API
│   ├── config/          # Database configuration
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── utils/           # Backend utilities
├── App.tsx              # Main App component
├── types.ts             # TypeScript type definitions
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/mfa/setup` - Setup MFA
- `POST /api/auth/mfa/verify` - Verify MFA token
- `GET /api/auth/me` - Get current user

### Resources
- `/api/users` - User management
- `/api/employees` - Employee CRUD
- `/api/departments` - Department CRUD
- `/api/attendance` - Attendance tracking
- `/api/leaves` - Leave requests
- `/api/payroll` - Payroll management
- `/api/notifications` - Notifications

See [server/README.md](server/README.md) for detailed API documentation.

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS** - Styling (custom design system)

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Speakeasy** - TOTP/MFA
- **bcrypt** - Password hashing

## 👤 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration

### HR
- Employee management
- Leave approval
- Payroll generation
- Reports

### Manager
- View team data
- Approve team leave requests
- View team payroll

### Employee
- View own profile
- Apply for leave
- View payslips
- Track attendance

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Multi-factor authentication (TOTP)
- Role-based access control
- CORS protection
- Input validation
- Secure session management

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

## 🧪 Development

### Frontend Development
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Backend Development
```bash
cd server
npm run dev       # Start with auto-reload
npm run seed      # Seed database
npm start         # Production mode
```

## 🚢 Production Deployment

### Frontend
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables

### Backend
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set a strong `JWT_SECRET`
4. Enable HTTPS
5. Configure CORS for your domain
6. Use a process manager (PM2, systemd)

### Recommended Hosting
- Frontend: Vercel, Netlify, AWS S3
- Backend: AWS EC2, DigitalOcean, Heroku
- Database: MongoDB Atlas, AWS DocumentDB

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

ISC

## 🤝 Contributing

This is a complete, production-ready HR Management System. Feel free to customize it for your needs.

## 📧 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, Node.js, and MongoDB**
