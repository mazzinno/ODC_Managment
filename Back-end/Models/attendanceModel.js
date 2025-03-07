const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sessionDate: { type: Date, required: true },
  participants: [
    {
      participantName: { type: String, required: true },
      morningStatus: { type: String, enum: ['Present', 'Absent'], default: 'Absent' },
      afternoonStatus: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
    }
  ]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
