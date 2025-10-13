import express from 'express';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import LeaveBalance from '../models/LeaveBalance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const employees = await Employee.find().populate('departmentId').populate('userId');
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('departmentId')
      .populate('userId');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error fetching employee' });
  }
});

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (Admin, HR)
router.post('/', protect, authorize('Admin', 'HR'), async (req, res) => {
  try {
    const { 
      employeeId, name, email, phone, avatarUrl, 
      departmentId, role, joinDate, status, employeeType, salary, password 
    } = req.body;

    // Check if employee ID already exists
    const employeeExists = await Employee.findOne({ employeeId });

    if (employeeExists) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Create user account for the employee
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'password',
      role: 'Employee',
      avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });

    // Create employee record
    const employee = await Employee.create({
      employeeId,
      userId: user._id,
      name,
      email: email.toLowerCase(),
      phone,
      avatarUrl: user.avatarUrl,
      departmentId,
      role,
      joinDate,
      status: status || 'Active',
      employeeType: employeeType || 'Permanent',
      salary
    });

    // Create default leave balance
    await LeaveBalance.create({
      employeeId: employee._id,
      balances: [
        { type: 'Annual', total: 20, used: 0, pending: 0 },
        { type: 'Sick', total: 10, used: 0, pending: 0 },
        { type: 'Casual', total: 5, used: 0, pending: 0 },
        { type: 'Unpaid', total: 99, used: 0, pending: 0 }
      ]
    });

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('departmentId')
      .populate('userId');

    res.status(201).json(populatedEmployee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error creating employee' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (Admin, HR)
router.put('/:id', protect, authorize('Admin', 'HR'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { 
      employeeId, name, email, phone, avatarUrl, 
      departmentId, role, joinDate, status, employeeType, salary 
    } = req.body;

    if (employeeId) employee.employeeId = employeeId;
    if (name) employee.name = name;
    if (email) employee.email = email.toLowerCase();
    if (phone) employee.phone = phone;
    if (avatarUrl) employee.avatarUrl = avatarUrl;
    if (departmentId) employee.departmentId = departmentId;
    if (role) employee.role = role;
    if (joinDate) employee.joinDate = joinDate;
    if (status) employee.status = status;
    if (employeeType) employee.employeeType = employeeType;
    if (salary !== undefined) employee.salary = salary;

    const updatedEmployee = await employee.save();

    // Also update user record if name or email changed
    if (name || email || avatarUrl) {
      const user = await User.findById(employee.userId);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (avatarUrl) user.avatarUrl = avatarUrl;
        await user.save();
      }
    }

    const populatedEmployee = await Employee.findById(updatedEmployee._id)
      .populate('departmentId')
      .populate('userId');

    res.json(populatedEmployee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error updating employee' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin, HR)
router.delete('/:id', protect, authorize('Admin', 'HR'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete associated user account
    await User.findByIdAndDelete(employee.userId);

    // Delete employee record
    await employee.deleteOne();

    res.json({ message: 'Employee removed' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
});

export default router;
