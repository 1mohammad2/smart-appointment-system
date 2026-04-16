const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateStatus,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validate');

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(validateAppointment, createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(authorize('admin'), deleteAppointment);

router.put('/:id/status', authorize('admin', 'staff'), updateStatus);

module.exports = router;