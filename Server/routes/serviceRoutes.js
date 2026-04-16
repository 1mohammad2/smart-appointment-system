const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const { validateService } = require('../middleware/validate');

router.get('/', getServices);

router.use(protect);
router.post('/', authorize('admin'), validateService, createService);
router.put('/:id', authorize('admin'), validateService, updateService);
router.delete('/:id', authorize('admin'), deleteService);

module.exports = router;