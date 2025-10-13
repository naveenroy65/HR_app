# WEintegrity HR Management System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get the application running locally for development or testing.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher - [Download](https://nodejs.org/)
- **MongoDB** v6 or higher - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## Step 1: Start MongoDB

### On macOS (using Homebrew):
```bash
brew services start mongodb-community@6.0
```

### On Windows:
```bash
# MongoDB should start automatically as a service
# Or manually start it:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="c:\data\db"
```

### On Linux:
```bash
sudo systemctl start mongod
```

### Verify MongoDB is running:
```bash
mongosh
# You should see MongoDB shell
```

## Step 2: Backend Setup

1. **Open a terminal and navigate to the server directory:**
```bash
cd /workspace/server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit `.env` file with your settings:**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/hr_management_system

JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRE=7d

# For development, you can use Ethereal Email (fake SMTP)
# Go to https://ethereal.email/ to create a free account
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email@ethereal.email
SMTP_PASS=your-ethereal-password
SMTP_FROM=noreply@weintegrity.com
```

5. **Seed the database (optional - creates sample data):**
```bash
npm run seed
```

This will create:
- Sample departments
- Sample employees
- Sample users with different roles
- Leave balances
- Sample data for testing

6. **Start the backend server:**
```bash
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

## Step 3: Frontend Setup

1. **Open a NEW terminal and navigate to the root directory:**
```bash
cd /workspace
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=WEintegrity HR Management System
VITE_APP_VERSION=1.0.0
```

5. **Start the frontend:**
```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

## Step 4: Access the Application

1. **Open your browser and go to:**
```
http://localhost:5173
```

2. **Login with default credentials (if you seeded the database):**

**Admin Account:**
```
Email: admin@weintegrity.com
Password: admin123
```

**HR Account:**
```
Email: hr@weintegrity.com
Password: hr123
```

**Manager Account:**
```
Email: manager@weintegrity.com
Password: manager123
```

**Employee Account:**
```
Email: employee@weintegrity.com
Password: employee123
```

## Step 5: Setup MFA (First Login)

When you log in for the first time:

1. After entering credentials, you'll be prompted to set up MFA
2. Scan the QR code with Google Authenticator or similar app
3. Enter the 6-digit code from your authenticator app
4. MFA is now enabled for your account

## 📱 Testing Email Functionality

If you're using Ethereal Email (recommended for development):

1. Go to https://ethereal.email/
2. Create a free account
3. Copy the SMTP credentials to your `.env` file
4. When the app sends emails, you can view them at https://ethereal.email/messages
5. No real emails are sent - perfect for testing!

## 🔍 Verify Everything is Working

### Backend Health Check:
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"HR Management API is running"}
```

### Check MongoDB Connection:
```bash
mongosh
use hr_management_system
db.users.find().pretty()
# Should show your users
```

### Frontend Check:
- Open http://localhost:5173
- You should see the login page
- No console errors

## 🎯 Quick Feature Test

1. **Login** as admin
2. **Navigate** to Employees page
3. **Create** a new employee
4. **Check** your Ethereal inbox for welcome email
5. **Submit** a leave request
6. **Approve** the leave as manager/admin
7. **View** reports

## 🛠️ Troubleshooting

### MongoDB Connection Issues:
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

### Port Already in Use:
```bash
# Backend (port 5000):
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows (find PID, then kill)

# Frontend (port 5173):
lsof -ti:5173 | xargs kill -9  # macOS/Linux
```

### Dependencies Issues:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Issues:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Next Steps

Once everything is running:

1. **Read the Documentation:**
   - [COMPREHENSIVE_README.md](./COMPREHENSIVE_README.md) - Full documentation
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment

2. **Explore the Features:**
   - Create employees
   - Submit leave requests
   - Generate payroll
   - Create exit interviews
   - View reports

3. **Test Different Roles:**
   - Login as Admin, HR, Manager, and Employee
   - See how the UI changes based on role
   - Test approval workflows

## 🎨 Development Tips

### Hot Reload:
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Using `--watch` flag for auto-restart

### Database GUI:
Install MongoDB Compass for easy database viewing:
```
https://www.mongodb.com/try/download/compass
```

### API Testing:
Use tools like:
- Postman - https://www.postman.com/
- Insomnia - https://insomnia.rest/
- Thunder Client (VS Code extension)

### VS Code Extensions (Recommended):
- ESLint
- Prettier
- MongoDB for VS Code
- REST Client
- GitLens

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| "Port already in use" | Kill process on that port |
| "MongoDB connection failed" | Ensure MongoDB is running |
| "Email not sending" | Check SMTP credentials in .env |
| "MFA QR not showing" | Clear browser cache |
| "401 Unauthorized" | Token expired, login again |

## 📞 Need Help?

If you encounter issues:

1. Check the [COMPREHENSIVE_README.md](./COMPREHENSIVE_README.md) for detailed information
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
5. Ensure all services (MongoDB, Backend, Frontend) are running

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend API is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Can access login page at http://localhost:5173
- [ ] Can login with default credentials
- [ ] Can see the dashboard
- [ ] Email notifications configured (Ethereal Email)
- [ ] No console errors

---

## 🎉 You're All Set!

Your WEintegrity HR Management System is now running locally. Start exploring the features and building your HR workflows!

For production deployment, refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

**Happy Coding! 🚀**
