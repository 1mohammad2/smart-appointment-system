const Joi = require('joi');

// دالة مساعدة ترجع middleware يتحقق من البيانات
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({
      success: false,
      message: messages,
    });
  }
  next();
};

// Schema للـ Register
exports.validateRegister = validate(
  Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
    phone: Joi.string().allow('').optional(),
    role: Joi.string().valid('customer', 'staff').optional(),
  })
);

// Schema للـ Login
exports.validateLogin = validate(
  Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  })
);

// Schema للـ Appointment
exports.validateAppointment = validate(
  Joi.object({
    staff: Joi.string().required().messages({
      'any.required': 'Staff member is required',
    }),
    service: Joi.string().required().messages({
      'any.required': 'Service is required',
    }),
    date: Joi.date().min('now').required().messages({
      'date.min': 'Appointment date must be in the future',
      'any.required': 'Date is required',
    }),
    startTime: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        'string.pattern.base': 'Start time must be in HH:MM format',
        'any.required': 'Start time is required',
      }),
    endTime: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        'string.pattern.base': 'End time must be in HH:MM format',
        'any.required': 'End time is required',
      }),
    notes: Joi.string().max(300).allow('').optional(),
  })
);

// Schema للـ Service
exports.validateService = validate(
  Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'any.required': 'Service name is required',
    }),
    description: Joi.string().max(500).allow('').optional(),
    duration: Joi.number().min(5).required().messages({
      'number.min': 'Duration must be at least 5 minutes',
      'any.required': 'Duration is required',
    }),
    price: Joi.number().min(0).required().messages({
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required',
    }),
  })
);