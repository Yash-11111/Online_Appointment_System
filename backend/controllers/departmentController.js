const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).sort('name');
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) { next(error); }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: department });
  } catch (error) { next(error); }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Admin
const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const department = await Department.create({ name, description });
    res.status(201).json({ success: true, message: 'Department created', data: department });
  } catch (error) { next(error); }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Admin
const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department updated', data: department });
  } catch (error) { next(error); }
};

// @desc    Delete department (soft delete)
// @route   DELETE /api/departments/:id
// @access  Admin
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department removed' });
  } catch (error) { next(error); }
};

module.exports = { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
