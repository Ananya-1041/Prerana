const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // Using Mongoose
const bcrypt = require('bcrypt');
const fs = require('fs'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve files from the uploads directory

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// --- MongoDB Connection ---
const uri = 'mongodb://localhost:27017/prerana_ghs';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB using Mongoose');
});

async function hashPassword(password) {
    const saltRounds = 10; // Adjust as needed for security vs. performance
    return await bcrypt.hash(password, saltRounds);
}

// --- Mongoose Schema Definitions ---

// Announcements
const announcementSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
});
const Announcement = mongoose.model('Announcement', announcementSchema);

// Events
const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  time: String,
  description: String,
});
const Event = mongoose.model('Event', eventSchema);

// ✅ Contact Submissions (Fixed with default timestamp)
const contactSubmissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);

// Students
const studentSchema = new mongoose.Schema({
  studentId: String,
  password: String,
  name: String,
  class: String,
  phone: String,
});
const Student = mongoose.model('Student', studentSchema);

// Teachers
const teacherSchema = new mongoose.Schema({
  teacherId: String,
  password: String,
  name: String,
  subject: String,
  phone: String,
});
const Teacher = mongoose.model('Teacher', teacherSchema);

// Admins
const adminSchema = new mongoose.Schema({
  adminId: String,
  password: String,
  name: String,
  lastLogin: Date,
});
const Admin = mongoose.model('Admin', adminSchema);

//study material schema
const studyMaterialSchema = new mongoose.Schema({
  fileName: String,
  subject: String,
  class: String, // <-- Add this
  uploadDate: { type: Date, default: Date.now },
  filePath: String,
});
const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

//question paper schema
const questionPaperSchema = new mongoose.Schema({
  fileName: String, // Added fileName to store original file name
  subject: String,
  class: String, //  <-- CONFIRMED: Class field is defined in schema
  year: String,
  type: String,
  size: String,
  date: String,
  uploadDate: { type: Date, default: Date.now },
  filePath: String,
});
const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);

//timetable schema
const timetableSchema = new mongoose.Schema({
  class: Number,
  uploadDate: { type: Date, default: Date.now },
  filePath: String,
});
const Timetable = mongoose.model('Timetable', timetableSchema);

// --- API Endpoints ---

// Get Announcements
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 });
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
});

// ✅ Add Announcement
app.post('/api/announcements', async (req, res) => {
    try {
        const { title, date, description } = req.body;

        // Basic validation
        if (!title || !date || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const announcement = new Announcement({
            title,
            date,
            description,
        });

        await announcement.save();
        res.status(201).json({ message: 'Announcement added successfully!' });
    } catch (error) {
        console.error('Error adding announcement:', error);
        res.status(500).json({ message: 'Failed to add announcement' });
    }
});

// ✅ Delete Announcement by Title
app.delete('/api/announcements/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const deletedAnnouncement = await Announcement.findOneAndDelete({ title }); // Find and delete by title
        if (deletedAnnouncement) {
            res.json({ message: `Announcement with title "${title}" deleted successfully!` });
        } else {
            res.status(404).json({ message: `Announcement with title "${title}" not found.` });
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Failed to delete announcement' });
    }
});

// Get Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// ✅ Add New Event
app.post('/api/events', async (req, res) => {
    try {
        const { name, date, time, description } = req.body;
        // Basic validation
        if (!name || !date || !time || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const event = new Event({
            name,
            date,
            time,
            description,
        });

        await event.save();
        res.status(201).json({ message: 'Event added successfully!' });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Failed to add event' });
    }
});

// ✅ Delete Event by Name
app.delete('/api/events/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const deletedEvent = await Event.findOneAndDelete({ name });
        if (deletedEvent) {
            res.json({ message: `Event "${name}" deleted successfully!` });
        } else {
            res.status(404).json({ message: `Event "${name}" not found.` });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
});

// API endpoint to get contact submissions
app.get('/api/contact-submissions', async (req, res) => {
    try {
        const submissions = await ContactSubmission.find().sort({ createdAt: -1 }); // Find all submissions, sort by latest first
        res.status(200).json(submissions); // Send a 200 OK status with the submissions in JSON format
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).json({ message: 'Failed to fetch contact submissions from the database.' }); // Send a 500 Internal Server Error with an error message
    }
});

// ✅ Contact Form Submission Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const submission = new ContactSubmission({
      name,
      email,
      phone,
      subject,
      message,
    });

    await submission.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Upload Study Material
app.post('/api/studymaterials', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) throw new Error('File not received');
    const { subject, date, class: className } = req.body; // ⬅️ extract `class`

    const newDoc = new StudyMaterial({
      fileName: req.file.originalname,
      subject,
      date,
      class: className, // ⬅️ include it in the document
      filePath: req.file.path,
    });

    await newDoc.save();
    res.status(200).json({ message: 'Study Material uploaded successfully.' });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Upload Question Paper
app.post('/api/questionpapers', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) throw new Error('File not received');
    // MODIFIED: Ensure 'class' is extracted from req.body
    const { subject, year, type, class: className } = req.body;

    const newDoc = new QuestionPaper({
      fileName: req.file.originalname,
      subject,
      class: className, // MODIFIED: Assign the extracted class to the document
      year,
      type,
      filePath: req.file.path,
    });
    await newDoc.save();
    res.status(200).json({ message: 'Question Paper uploaded successfully.' });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Upload Timetable
app.post('/api/timetables', upload.single('file'), async (req, res) => {
  try {
    const { class: classNum } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    if (!classNum) {
        // You might want to consider sending a default class or making it mandatory
        return res.status(400).json({ message: 'Class number is required.' });
    }

    // Check if a timetable for this class already exists
    const existingTimetable = await Timetable.findOne({ class: Number(classNum) });
    if (existingTimetable) {
        // If exists, update it
        existingTimetable.filePath = req.file.path;
        existingTimetable.uploadDate = Date.now();
        await existingTimetable.save();
        return res.status(200).json({ message: 'Timetable updated successfully.' });
    }

    // If not, create a new one
    const newDoc = new Timetable({
      class: Number(classNum),
      filePath: req.file.path,
    });
    await newDoc.save();
    res.status(200).json({ message: 'Timetable uploaded successfully.' });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Question Papers (with optional filtering) ---
app.get('/api/question-papers', async (req, res) => {
  try {
    // MODIFIED: Accept 'studentClass' as a query parameter for filtering
    const { studentId, subject, year, studentClass } = req.query;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const filters = {};

    // Apply class filter if provided
    if (studentClass && studentClass !== 'All') {
      filters.class = studentClass;
    }
    if (subject && subject !== 'All') {
      filters.subject = subject;
    }
    if (year && year !== 'All') {
      filters.year = year;
    }

    const papers = await QuestionPaper.find(filters).sort({ uploadDate: -1 });

    const papersWithUrls = papers.map(paper => ({
      id: paper._id,
      fileName: paper.fileName,
      subject: paper.subject,
      class: paper.class, // Ensure class is included in the response
      year: paper.year,
      type: paper.type,
      uploadDate: paper.uploadDate,
      filePath: paper.filePath,
      downloadUrl: `/uploads/${path.basename(paper.filePath)}`,
      viewUrl: `/api/view-pdf/${path.basename(paper.filePath)}`,
    }));

    res.json(papersWithUrls);
  } catch (error) {
    console.error('Error fetching question papers:', error);
    res.status(500).json({ message: 'Failed to fetch question papers' });
  }
});

// Get Counts for Student Home (FIXED)
app.get('/api/student/home-counts', async (req, res) => {
  try {
    const { studentId } = req.query;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const questionPaperCount = await QuestionPaper.countDocuments(); // All question papers
    const studyMaterialCount = await StudyMaterial.countDocuments({ class: student.class });

    res.json({ questionPapers: questionPaperCount, studyMaterials: studyMaterialCount });
  } catch (error) {
    console.error('Error fetching student home counts:', error);
    res.status(500).json({ message: 'Failed to fetch counts' });
  }
});

// Get Recent Study Materials (FIXED)
app.get('/api/student/recent-materials', async (req, res) => {
  try {
    const { studentId } = req.query;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const recentMaterials = await StudyMaterial.find({ class: student.class })
      .sort({ uploadDate: -1 })
      .limit(5);

    const materials = recentMaterials.map(mat => ({
      id: mat._id,
      fileName: mat.fileName,
      subject: mat.subject,
      uploadDate: mat.uploadDate,
      filePath: mat.filePath,
      downloadUrl: `/uploads/${path.basename(mat.filePath)}`,
      viewUrl: mat.filePath.toLowerCase().endsWith('.pdf') ? `/api/view-pdf/${path.basename(mat.filePath)}` : `/uploads/${path.basename(mat.filePath)}`,
    }));

    res.json(materials);
  } catch (error) {
    console.error('Error fetching recent materials:', error);
    res.status(500).json({ message: 'Failed to fetch recent materials' });
  }
});

// NEW ENDPOINT: Get Student Details (e.g., class)
app.get('/api/student/details', async (req, res) => {
  try {
    const { studentId } = req.query;
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ class: student.class, name: student.name });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Failed to fetch student details' });
  }
});


app.get('/api/student/study-materials', async (req, res) => {
  try {
    const { studentId } = req.query;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const materials = await StudyMaterial.find({ class: student.class })
      .sort({ uploadDate: -1 });

    const materialsWithUrls = materials.map(mat => ({
      id: mat._id,
      fileName: mat.fileName,
      subject: mat.subject,
      class: mat.class,
      uploadDate: mat.uploadDate,
      filePath: mat.filePath,
      downloadUrl: `/uploads/${path.basename(mat.filePath)}`,
      viewUrl: mat.filePath.toLowerCase().endsWith('.pdf') ? `/api/view-pdf/${path.basename(mat.filePath)}` : `/uploads/${path.basename(mat.filePath)}`,
    }));

    res.json(materialsWithUrls);
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ message: 'Failed to fetch study materials' });
  }
});

// Get All Question Papers for Student (UPDATED)
app.get('/api/student/question-papers', async (req, res) => {
  try {
    // MODIFIED: Accept 'studentClass' as a query parameter for filtering
    const { studentId, subject, year, studentClass } = req.query;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const filters = {};

    // Apply class filter if provided
    if (studentClass && studentClass !== 'All') {
      filters.class = studentClass;
    }
    if (subject && subject !== 'All') {
      filters.subject = subject;
    }
    if (year && year !== 'All') {
      filters.year = year;
    }

    const papers = await QuestionPaper.find(filters).sort({ uploadDate: -1 });

    const papersWithUrls = papers.map(paper => ({
      id: paper._id,
      fileName: paper.fileName,
      subject: paper.subject,
      class: paper.class, // Ensure class is included in the response
      year: paper.year,
      type: paper.type,
      uploadDate: paper.uploadDate,
      filePath: paper.filePath,
      downloadUrl: `/uploads/${path.basename(paper.filePath)}`,
      viewUrl: `/api/view-pdf/${path.basename(paper.filePath)}`,
    }));

    res.json(papersWithUrls);
  } catch (error) {
    console.error('Error fetching question papers:', error);
    res.status(500).json({ message: 'Failed to fetch question papers' });
  }
});

// Serve PDF files for viewing (NEW)
app.get('/api/view-pdf/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Timetable by Class - This endpoint is good for direct access if you know the class
app.get('/api/timetable/:class', async (req, res) => {
  try {
    const { class: requestedClass } = req.params;
    const timetable = await Timetable.findOne({ class: requestedClass });
    if (timetable) {
      res.json({
        class: timetable.class, // Include class
        uploadDate: timetable.uploadDate, // Include uploadDate
        downloadUrl: `/uploads/${path.basename(timetable.filePath)}`,
        viewUrl: `/api/view-pdf/${path.basename(timetable.filePath)}`, // Add viewUrl
      });
    } else {
      res.status(404).json({ message: 'Timetable not found for this class' });
    }
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Failed to fetch timetable' });
  }
});

// NEW ENDPOINT: Get Timetable for a specific student's class
app.get('/api/student/timetable', async (req, res) => {
  try {
    const { studentId } = req.query;
    const student = await Student.findOne({ studentId });
    if (!student) {
      // This should return JSON
      return res.status(404).json({ message: 'Student not found' });
    }

    const timetable = await Timetable.findOne({ class: student.class });

    if (timetable) {
      // This should return JSON
      res.json({
        class: timetable.class,
        uploadDate: timetable.uploadDate,
        downloadUrl: `/uploads/${path.basename(timetable.filePath)}`,
        viewUrl: `/api/view-pdf/${path.basename(timetable.filePath)}`,
      });
    } else {
      // This should return JSON
      res.status(404).json({ message: 'Timetable not found for your class.' });
    }
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    // This should return JSON
    res.status(500).json({ message: 'Failed to fetch student timetable.' });
  }
});

// Serve PDF files for viewing (NEW)
app.get('/api/view-pdf/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // **Crucial point for this error**: If file not found, DO NOT send JSON here
      // because the browser expects a PDF.
      // Instead, just end the request or return a generic 404 WITHOUT HTML.
      // Or, even better, let it fall through to a default static handler if configured,
      // or directly respond with a plain text not found.
      // For now, let's keep it simple: just end it.
      return res.status(404).send('File not found');
    }

    // Set headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving PDF:', error);
    // If an error occurs during file serving, simply send a 500 status
    res.status(500).send('Error serving file');
  }
});


// Get Available Classes for Timetable ---
app.get('/api/timetable/classes', async (req, res) => {
  try {
    const classes = await Timetable.distinct('class');
    res.json(classes);
  } catch (error) {
    console.error('Error fetching timetable classes:', error);
    res.status(500).json({ message: 'Failed to fetch timetable classes' });
  }
});

// change password for students
app.post('/api/student/change-password', async (req, res) => {
  const { studentId, currentPassword, newPassword } = req.body;

  try {
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;

    await student.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// change password for teachers
app.put('/api/teacher/change-password', async (req, res) => {
  const { teacherId, currentPassword, newPassword } = req.body;

  try {
    const teacher = await Teacher.findOne({ teacherId });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;
    await teacher.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login with Conditional Password Check
app.post('/api/login', async (req, res) => {
    try {
        const { role, studentId, teacherId, adminId, password } = req.body;
        let user;
        let passwordMatch = false;

        if (role === 'student') {
          const student = await Student.findOne({ studentId });
          if (!student) return res.status(404).json({ message: 'Student not found' });

          const isMatch = await bcrypt.compare(password, student.password);
          if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

          res.json({ message: 'Login successful', role: 'student', studentId: student.studentId });
        } else if (role === 'teacher') {
            const teacher = await Teacher.findOne({ teacherId });
            if (!teacher) {
              return res.status(404).json({ message: 'Teacher not found' });
            }

            const isMatch = await bcrypt.compare(password, teacher.password);
            if (!isMatch) {
              return res.status(401).json({ message: 'Invalid password' });
            }

            return res.json({ message: 'Login successful!', role: 'teacher', teacherId: teacher.teacherId });
        } else if (role === 'admin') {
            user = await Admin.findOne({ adminId, password }); // Directly compare plain text for admin
            passwordMatch = !!user; // If user is found, password matches (plain text comparison)
        }

        if (passwordMatch) {
            res.json({ message: 'Login successful!', role: role });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// ✅ Endpoint to add a new student with password hashing
app.post('/api/students', async (req, res) => {
    try {
        const { studentId, password, name, className, phone } = req.body;

        // Check if a student with the given ID already exists
        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent) {
            return res.status(409).json({ message: 'Student with this ID already exists.' });
        }

        const hashedPassword = await hashPassword(password);

        const newStudent = new Student({
            studentId,
            password: hashedPassword,
            name,
            class: className,
            phone,
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully!' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Failed to add student.' });
    }
});

// ✅ Endpoint to delete a student by ID
app.delete('/api/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const deletedStudent = await Student.findOneAndDelete({ studentId });
        if (deletedStudent) {
            res.json({ message: `Student with ID ${studentId} deleted successfully!` });
        } else {
            res.status(404).json({ message: `Student with ID ${studentId} not found.` });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Failed to delete student.' });
    }
});

// ✅ Endpoint to add a new teacher with password hashing
app.post('/api/teachers', async (req, res) => {
    try {
        const { teacherId, password, name, subject, phone } = req.body;

        // Hash the password before saving
        const hashedPassword = await hashPassword(password);

        const newTeacher = new Teacher({
            teacherId,
            password: hashedPassword, // Save the hashed password
            name,
            subject,
            phone,
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher added successfully!' });
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.status(500).json({ message: 'Failed to add teacher' });
    }
});

// ✅ Endpoint to delete a teacher by ID
app.delete('/api/teachers/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    try {
        const deletedTeacher = await Teacher.findOneAndDelete({ teacherId });
        if (deletedTeacher) {
            res.json({ message: `Teacher with ID ${teacherId} deleted successfully!` });
        } else {
            res.status(404).json({ message: `Teacher with ID ${teacherId} not found.` });
        }
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ message: 'Failed to delete teacher.' });
    }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});