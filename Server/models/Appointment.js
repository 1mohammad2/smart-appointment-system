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
  { timestamps: true }
);

AppointmentSchema.index({ date: 1, staff: 1 });

// ✅ بدون next — متوافق مع mongoose الجديد
AppointmentSchema.pre('save', async function () {
  if (!this.isModified('date') && !this.isModified('startTime')) return;

  const conflict = await mongoose.model('Appointment').findOne({
    staff: this.staff,
    date: this.date,
    status: { $nin: ['cancelled'] },
    _id: { $ne: this._id },
    startTime: { $lt: this.endTime },
    endTime: { $gt: this.startTime },
  });

  if (conflict) {
    throw new Error('This time slot is already booked for this staff member');
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);