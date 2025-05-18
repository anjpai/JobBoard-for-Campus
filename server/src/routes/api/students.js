const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('../../models/Student');
const auth = require('../../middlewares/authorization');
const { STUDENT, COMPANY, ADMIN } = require('../../constants/roles');

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/resumes';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Get all students (admin and company only)
router.get('/', auth, (req, res) => {
  if (req.user.role === STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  Student.find({})
    .then(students => res.status(200).send(students))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Get specific student (admin and company only)
router.get('/:id', auth, (req, res) => {
  if (req.user.role === STUDENT) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  Student.findById(req.params.id)
    .then(student => res.status(200).send(student))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Delete student (admin only)
router.delete('/:id', auth, (req, res) => {
  if (req.user.role !== ADMIN) {
    return res.status(401).send({ message: 'Access denied.' });
  }

  Student.deleteOne({ _id: req.params.id })
    .then(success => res.status(200).send(success.deletedCount.toString()))
    .catch(error => res.status(400).send({ message: error.message }));
});

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, education, skills } = req.body;
    const student = await Student.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.education = education || student.education;
    student.skills = skills || student.skills;

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upload resume
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete old resume if exists
    if (student.resume && student.resume.path) {
      const oldPath = path.join(__dirname, '../../../', student.resume.path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    student.resume = {
      filename: req.file.originalname,
      path: req.file.path,
      uploadDate: new Date()
    };

    await student.save();
    res.json({ message: 'Resume uploaded successfully', resume: student.resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get resume
router.get('/resume/:studentId', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student || !student.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const file = path.join(__dirname, '../../../', student.resume.path);
    res.download(file, student.resume.filename);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status
router.put('/applications/:applicationId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const application = student.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await student.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
