const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// الـ GET متاح للجميع بدون login
router.get('/', getServices);

// الباقي يحتاج login وصلاحية admin
router.use(protect);
router.post('/', authorize('admin'), createService);
router.put('/:id', authorize('admin'), updateService);
router.delete('/:id', authorize('admin'), deleteService);

module.exports = router;