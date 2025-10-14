# Full Stack HR Management System - Quick Reference

## 🚀 Get Started in 3 Steps

```bash
# 1. Setup
./setup.sh

# 2. Configure MongoDB in server/.env
MONGODB_URI=mongodb://localhost:27017/hr_management_system

# 3. Run
npm run dev:fullstack
```

**Access**: http://localhost:5173

---

## 📋 Quick Commands

| Command | Description |
|---------|-------------|
| `npm run dev:fullstack` | Run frontend + backend together |
| `npm run install:all` | Install all dependencies |
| `npm run dev` | Frontend only (port 5173) |
| `npm run server:dev` | Backend only (port 5000) |
| `cd server && npm run seed` | Seed database with sample data |

---

## 🔌 API Endpoints (Quick)

### Base URL
```
http://localhost:5000/api
```

### Authentication
- `POST /auth/login` - Login
- `POST /auth/mfa/setup` - Setup MFA
- `POST /auth/mfa/verify` - Verify MFA

### Employees
- `GET /employees` - List all
- `POST /employees` - Create
- `PUT /employees/:id` - Update
- `DELETE /employees/:id` - Delete

### Attendance
- `POST /attendance/clock-in` - Clock in
- `POST /attendance/clock-out` - Clock out
- `GET /attendance/today` - Today's record

### Leaves
- `GET /leaves` - List requests
- `POST /leaves` - Submit request
- `PUT /leaves/:id/status` - Approve/Reject

---

## 🗄️ MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

### MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hr_management_system
```

---

## 🔐 Default Login (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hrms.com | password |
| HR | hr@hrms.com | password |
| Manager | manager@hrms.com | password |
| Employee | employee@hrms.com | password |

---

## 📁 Project Structure

```
workspace/
├── services/              # ⭐ API service layer
│   ├── api.ts            # Axios config
│   ├── authService.ts    # Auth endpoints
│   ├── employeeService.ts
│   └── ...
├── components/           # React components
├── server/              # ⭐ Backend
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Express app
├── .env                 # Frontend config
└── server/.env          # Backend config
```

---

## 🐛 Troubleshooting

### MongoDB Not Connected
```bash
# Check if running
mongosh

# Restart
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Kill port 5000
lsof -ti:5000 | xargs kill -9

# Kill port 5173
lsof -ti:5173 | xargs kill -9
```

### Missing Dependencies
```bash
npm run install:all
```

### CORS Errors
Check `server/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Full Documentation

| Guide | Purpose |
|-------|---------|
| [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md) | Complete setup guide |
| [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) | Frontend API integration |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference |
| [FULLSTACK_INTEGRATION_SUMMARY.md](./FULLSTACK_INTEGRATION_SUMMARY.md) | What was built |

---

## ✅ Quick Checklist

Setup:
- [ ] Run `./setup.sh`
- [ ] Configure MongoDB URI in `server/.env`
- [ ] Update `JWT_SECRET` in `server/.env`
- [ ] Run `cd server && npm run seed` (optional)

Verify:
- [ ] Backend health check: `curl http://localhost:5000/api/health`
- [ ] Frontend loads: http://localhost:5173
- [ ] Login works with test credentials

---

## 🎯 Most Common Tasks

### Start Development
```bash
npm run dev:fullstack
```

### Create Employee (API)
```typescript
import { employeeService } from './services';
const employee = await employeeService.createEmployee(data);
```

### Clock In (API)
```typescript
import { attendanceService } from './services';
const result = await attendanceService.clockIn();
```

### Apply Leave (API)
```typescript
import { leaveService } from './services';
const request = await leaveService.createLeaveRequest(data);
```

---

## 🔒 Security Note

**Before Production:**
1. Change `JWT_SECRET` to random string
2. Change `SESSION_SECRET` to random string
3. Use production MongoDB with auth
4. Enable HTTPS
5. Update CORS settings

---

## 📞 Need Help?

1. **Setup Issues**: [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md)
2. **API Integration**: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
3. **API Reference**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Pro Tip**: Start with authentication integration, then add other modules one by one!

🚀 **Happy Coding!**
