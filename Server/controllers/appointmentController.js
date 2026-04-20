const Appointment = require('../models/Appointment');
const {
  sendBookingConfirmation,
  sendCancellationNotice,
} = require('../services/emailService');

// ── GET /api/appointments ─────────────────────────────
exports.getAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      startDate,
      endDate,
    } = req.query;

    // بناء الـ query حسب الـ role
    let filter = {};

    if (req.user.role === 'staff') {
      filter.staff = req.user.id;
    } else if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    }

    // فلتر الـ status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // فلتر التاريخ
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // حساب الـ pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // جلب المواعيد مع الـ populate
    let query = Appointment.find(filter)
      .populate('customer', 'name email phone')
      .populate('staff', 'name email')
      .populate('service', 'name duration price')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limitNum);

    const [appointments, total] = await Promise.all([
      query,
      Appointment.countDocuments(filter),
    ]);

    // البحث بالاسم بعد الـ populate
    let results = appointments;
    if (search) {
      const searchLower = search.toLowerCase();
      results = appointments.filter(
        (apt) =>
          apt.customer?.name?.toLowerCase().includes(searchLower) ||
          apt.service?.name?.toLowerCase().includes(searchLower) ||
          apt.staff?.name?.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/appointments/:id ─────────────────────────
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

// ── POST /api/appointments ────────────────────────────
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

// ── PUT /api/appointments/:id ─────────────────────────
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

// ── DELETE /api/appointments/:id ──────────────────────
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

// ── PUT /api/appointments/:id/status ──────────────────
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