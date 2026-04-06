const Appointment = require('../models/Appointment');
const {
  sendBookingConfirmation,
  sendCancellationNotice,
} = require('../services/emailService');

// ── @route   GET /api/appointments ────────────────────
exports.getAppointments = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Appointment.find();
    } else if (req.user.role === 'staff') {
      query = Appointment.find({ staff: req.user.id });
    } else {
      query = Appointment.find({ customer: req.user.id });
    }

    const appointments = await query
      .populate('customer', 'name email phone')
      .populate('staff', 'name email')
      .populate('service', 'name duration price')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   GET /api/appointments/:id ────────────────
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('staff', 'name email')
      .populate('service', 'name duration price');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/appointments ───────────────────
exports.createAppointment = async (req, res) => {
  try {
    const { staff, service, date, startTime, endTime, notes } = req.body;

    const appointment = await Appointment.create({
      customer: req.user.id,
      staff,
      service,
      date,
      startTime,
      endTime,
      notes,
    });

    res.status(201).json({ success: true, data: appointment });

    // أرسل confirmation email بعد الـ response مباشرة
    try {
      const populated = await Appointment.findById(appointment._id)
        .populate('customer', 'name email')
        .populate('staff', 'name')
        .populate('service', 'name price');
      await sendBookingConfirmation(populated);
    } catch (emailErr) {
      console.error('Confirmation email failed:', emailErr.message);
    }
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   PUT /api/appointments/:id ────────────────
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      appointment.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   DELETE /api/appointments/:id ─────────────
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete appointments',
      });
    }

    await appointment.deleteOne();
    res.status(200).json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   PUT /api/appointments/:id/status ─────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({ success: true, data: appointment });

    // لو الـ status تغيّر لـ cancelled، أرسل إشعار إلغاء
    if (status === 'cancelled') {
      try {
        const populated = await Appointment.findById(req.params.id)
          .populate('customer', 'name email')
          .populate('staff', 'name')
          .populate('service', 'name price');
        await sendCancellationNotice(populated);
      } catch (emailErr) {
        console.error('Cancellation email failed:', emailErr.message);
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};