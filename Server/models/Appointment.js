const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Staff member is required'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      // format: "HH:MM" مثلاً "09:30"
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Index ──────────────────────────────────────────────
// يسرّع البحث عن المواعيد بالتاريخ والـ staff
AppointmentSchema.index({ date: 1, staff: 1 });

// ── Smart Scheduling ───────────────────────────────────
// قبل الحفظ: تحقق أن ما في موعد آخر بنفس الوقت لنفس الـ staff
AppointmentSchema.pre('save', async function (next) {
  if (!this.isModified('date') && !this.isModified('startTime')) {
    return next();
  }

  const conflict = await this.constructor.findOne({
    staff: this.staff,
    date: this.date,
    status: { $nin: ['cancelled'] },
    _id: { $ne: this._id },
    $or: [
      { startTime: { $lt: this.endTime }, endTime: { $gt: this.startTime } },
    ],
  });

  if (conflict) {
    const error = new Error('This time slot is already booked for this staff member');
    error.statusCode = 400;
    return next(error);
  }

  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);