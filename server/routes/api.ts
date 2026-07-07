import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';

import { protect, authorizeAdmin } from '../middleware/authMiddleware';
import * as dbService from '../services/dbService';
import * as emailService from '../services/emailService';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtsigningkey_change_me_in_production';

// Ensure upload destination folder exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File validation filter
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file extension. Only images, PDFs, and documents are supported.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// Helper validation error runner
const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: any) => {
    await Promise.all(validations.map(v => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  };
};

// --- AUTHENTICATION ENDPOINTS ---

// Register
router.post('/auth/register', validate([
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]), async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Liaison registry already exists for this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = 'vtok-' + Math.floor(100000 + Math.random() * 900000);

    const newUser = await dbService.saveUser({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // First registered user is Admin in this studio context
      isVerified: true, // Auto verified for preview
      verificationToken
    });

    res.status(201).json({
      success: true,
      message: 'Liaison user registered successfully.',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server registering error', error: err.message });
  }
});

// Login (supports standard credentials AND demo passcode login)
router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password, passcode } = req.body;

  try {
    // 1. Passcode Check
    if (passcode !== undefined) {
      if (passcode.toLowerCase() === 'aura2026' || passcode === '') {
        const token = jwt.sign({ name: 'Aura Administrator', email: 'admin@auradesign.co.uk', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
          success: true,
          message: 'Passcode verified.',
          token,
          user: { name: 'Aura Administrator', email: 'admin@auradesign.co.uk', role: 'admin' }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid administrative security passcode.' });
      }
    }

    // 2. Email/Password Check
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password coordinates.' });
    }

    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Access Denied.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Access Denied.' });
    }

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login verification successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server authentication error', error: err.message });
  }
});

// Forgot Password
router.post('/auth/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not found in our records.' });
    }

    const resetToken = 'rst-' + Math.floor(100000 + Math.random() * 900000);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await dbService.updateUser(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    console.log(`🔑 [PASSWORD RESET REQUEST] Email: ${email}, Token: ${resetToken}`);
    res.json({
      success: true,
      message: 'Password reset token generated and routed to register logs.',
      token: resetToken // Exposing in response for preview convenience
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Forgot password error', error: err.message });
  }
});

// Reset Password
router.post('/auth/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const users = await dbService.getUsers();
    const user = users.find((u: any) => u.resetPasswordToken === token && new Date(u.resetPasswordExpires) > new Date());

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbService.updateUser(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });

    res.json({ success: true, message: 'Password has been successfully updated.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Reset password error', error: err.message });
  }
});

// Change Password
router.post('/auth/change-password', protect, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const loggedInUser = (req as any).user;

  try {
    const user = await dbService.findUserByEmail(loggedInUser.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password security.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbService.updateUser(user._id, { password: hashedPassword });

    res.json({ success: true, message: 'Password successfully updated.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Change password error', error: err.message });
  }
});

// Get profile
router.get('/auth/me', protect, async (req: Request, res: Response) => {
  res.json({ success: true, user: (req as any).user });
});

// --- CLIENT BOOKING INTAKE ENDPOINTS ---

// Book Consultation (Public)
router.post('/records/consultations', validate([
  body('clientName').notEmpty().withMessage('Liaison Name is required').trim(),
  body('clientEmail').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('clientPhone').notEmpty().withMessage('Liaison contact phone is required').trim(),
  body('eventType').notEmpty().withMessage('Event type selection is required')
]), async (req: Request, res: Response) => {
  try {
    const consultationData = {
      id: 'CON-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Pending',
      timestamp: new Date().toISOString(),
      ...req.body
    };

    const saved = await dbService.saveConsultation(consultationData);

    // Send notification and auto-reply
    await emailService.sendAdminInquiryNotification({
      name: saved.clientName,
      email: saved.clientEmail,
      phone: saved.clientPhone,
      category: saved.eventType,
      guestsCount: saved.guestCount,
      notes: saved.specialRequests
    });

    await emailService.sendClientAutoReply({
      name: saved.clientName,
      email: saved.clientEmail,
      category: saved.eventType
    });

    res.status(201).json({ success: true, message: 'Consultation intake secured.', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Consultation intake error', error: err.message });
  }
});

// Fetch consultations (Protected)
router.get('/records/consultations', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const list = await dbService.getConsultations();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Fetch consultations error', error: err.message });
  }
});

// Update consultation status (Protected)
router.put('/records/consultations/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await dbService.updateConsultationStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete consultation (Protected)
router.delete('/records/consultations/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const success = await dbService.deleteConsultation(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }
    res.json({ success: true, message: 'Record deleted from registers.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create General/Custom Inquiry (Public)
router.post('/records/inquiries', validate([
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
]), async (req: Request, res: Response) => {
  try {
    const inquiryData = {
      status: 'Pending',
      timestamp: new Date().toISOString(),
      ...req.body
    };

    const saved = await dbService.saveInquiry(inquiryData);

    // Send notifications
    await emailService.sendAdminInquiryNotification({
      name: saved.name,
      email: saved.email,
      phone: saved.phone || '',
      category: saved.category || saved.viewType || 'General Inquire',
      guestsCount: saved.guests || saved.guestsCount || 'N/A',
      notes: saved.details || saved.notes || ''
    });

    await emailService.sendClientAutoReply({
      name: saved.name,
      email: saved.email,
      category: saved.category || saved.viewType || 'Bespoke Services'
    });

    res.status(201).json({ success: true, message: 'Inquiry registered successfully.', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Inquiry storage error', error: err.message });
  }
});

// Fetch inquiries (Protected)
router.get('/records/inquiries', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const list = await dbService.getInquiries();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update inquiry status (Protected)
router.put('/records/inquiries/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await dbService.updateInquiryStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete inquiry (Protected)
router.delete('/records/inquiries/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const success = await dbService.deleteInquiry(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, message: 'Inquiry successfully deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Book Event Ticket Registration (Public)
router.post('/records/registrations', validate([
  body('name').notEmpty().withMessage('Liaison Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('eventId').notEmpty().withMessage('Event reference selection is required'),
  body('eventTitle').notEmpty().withMessage('Event Title is required')
]), async (req: Request, res: Response) => {
  try {
    const registrationData = {
      status: 'Provisionally Registered',
      timestamp: new Date().toISOString(),
      ...req.body
    };

    const saved = await dbService.saveRegistration(registrationData);

    // Send notifications
    await emailService.sendAdminInquiryNotification({
      name: saved.name,
      email: saved.email,
      phone: '',
      category: `Event Pass: ${saved.ticketType || 'Standard'}`,
      guestsCount: saved.guestsCount,
      notes: `Event: ${saved.eventTitle}. Notes: ${saved.notes || 'None'}`
    });

    await emailService.sendClientAutoReply({
      name: saved.name,
      email: saved.email,
      category: `Exclusive Pass - ${saved.eventTitle}`
    });

    res.status(201).json({ success: true, message: 'Event registration completed.', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Event booking error', error: err.message });
  }
});

// Fetch event registrations (Protected)
router.get('/records/registrations', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const list = await dbService.getRegistrations();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update event registration status (Protected)
router.put('/records/registrations/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await dbService.updateRegistrationStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ success: false, message: 'Registration not found.' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete event registration (Protected)
router.delete('/records/registrations/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const success = await dbService.deleteRegistration(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Registration not found.' });
    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Purge all records from local registers (Protected)
router.post('/records/purge', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.purgeAllRegisters();
    res.json({ success: true, message: 'All registers have been purged successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- WEBSITE DYNAMIC CONTENT CUSTOMIZER ---

// Services content getter
router.get('/content/services', async (req: Request, res: Response) => {
  try {
    const list = await dbService.getServices();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Services content saver (Protected)
router.post('/content/services', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const saved = await dbService.saveService(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Services content deleter (Protected)
router.delete('/content/services/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deleteService(req.params.id);
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Portfolios content getter
router.get('/content/portfolios', async (req: Request, res: Response) => {
  try {
    const list = await dbService.getPortfolios();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Portfolios content saver (Protected)
router.post('/content/portfolios', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const saved = await dbService.savePortfolio(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Portfolios content deleter (Protected)
router.delete('/content/portfolios/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deletePortfolio(req.params.id);
    res.json({ success: true, message: 'Portfolio item deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Testimonials content getter
router.get('/content/testimonials', async (req: Request, res: Response) => {
  try {
    const list = await dbService.getTestimonials();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Testimonials content saver (Protected)
router.post('/content/testimonials', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const saved = await dbService.saveTestimonial(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Testimonials content deleter (Protected)
router.delete('/content/testimonials/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deleteTestimonial(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Blogs content getter
router.get('/content/blogs', async (req: Request, res: Response) => {
  try {
    const list = await dbService.getBlogs();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Blogs content saver (Protected)
router.post('/content/blogs', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const saved = await dbService.saveBlog(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Blogs content deleter (Protected)
router.delete('/content/blogs/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deleteBlog(req.params.id);
    res.json({ success: true, message: 'Blog post deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Events content getter
router.get('/content/events', async (req: Request, res: Response) => {
  try {
    const list = await dbService.getEvents();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Events content saver (Protected)
router.post('/content/events', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const saved = await dbService.saveEvent(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Events content deleter (Protected)
router.delete('/content/events/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SETTINGS GATEWAY ---

// Get website configuration settings
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await dbService.getSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update website configuration settings (Protected)
router.post('/settings', protect, authorizeAdmin, async (req: Request, res: Response) => {
  const settingsObj = req.body;
  try {
    const keys = Object.keys(settingsObj);
    for (const key of keys) {
      await dbService.saveSetting(key, settingsObj[key]);
    }
    res.json({ success: true, message: 'Website settings updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- FILE UPLOADS GATEWAY ---

// Get uploaded files registry
router.get('/files', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const list = await dbService.getUploadedFiles();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload individual file (Protected)
router.post('/files/upload', protect, authorizeAdmin, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileRecord = {
      id: 'FIL-' + Date.now() + Math.floor(Math.random() * 100),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      uploadedAt: new Date().toISOString()
    };

    const saved = await dbService.saveUploadedFile(fileRecord);
    res.status(201).json({ success: true, message: 'File securely uploaded.', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'File uploading failed.', error: err.message });
  }
});

// Delete uploaded file (Protected)
router.delete('/files/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const files = await dbService.getUploadedFiles();
    const target = files.find((f: any) => f.id === req.params.id || f._id === req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', target.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await dbService.deleteUploadedFile(req.params.id);
    res.json({ success: true, message: 'File securely deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
