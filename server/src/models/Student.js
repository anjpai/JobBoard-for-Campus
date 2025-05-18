const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { STUDENT } = require('../constants/roles');

const StudentSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: STUDENT,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  education: {
    degree: String,
    institution: String,
    graduationYear: Number,
    gpa: Number,
  },
  skills: [String],
  resume: {
    filename: String,
    path: String,
    uploadDate: Date,
  },
  applications: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    }
  }]
});

StudentSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
});

module.exports = mongoose.model('Student', StudentSchema);
