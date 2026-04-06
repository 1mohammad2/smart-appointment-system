const Service = require('../models/Service');

// ── @route   GET /api/services ────────────────────────
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/services ───────────────────────
exports.createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   PUT /api/services/:id ────────────────────
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   DELETE /api/services/:id ─────────────────
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({ success: true, message: 'Service deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};