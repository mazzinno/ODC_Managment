const { User } = require('../Models/userModel');
const Course = require('../Models/courseModel');  
const Candidate = require('../Models/candidateModel');


const Totalmentors = async (req, res) => {
  try {
    const mentorCount = await User.countDocuments({ role: 'Mentor' });
    res.status(200).json({ totalMentors: mentorCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting mentors', error });
  }
};

const GetFormationscount = async (req, res) => {
    try {
      const courseCount = await Course.countDocuments();
      res.status(200).json({ totalCourses: courseCount });
    } catch (error) {
      res.status(500).json({ message: 'Error counting courses', error: error.message });
    }
  };

const GetCurrentFormationscount = async (req, res) => {
    try {
        const currentDate = new Date();
                const currentFormationCount = await Course.countDocuments({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
        });

        res.status(200).json({ currentFormations: currentFormationCount });
    } catch (error) {
        res.status(500).json({ message: 'Error counting current formations', error: error.message });
    }
    };

const GetFormations = async (req, res) => {
    try {
        const courses = await Course.find().populate('mentors');  // Use the Course model
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
    };

const Confirmationrate = async (req, res) => {
    try {
        const totalCandidates = await Candidate.countDocuments();
    
        const confirmedCandidates = await Candidate.countDocuments({ presenceState: true });
    
        const confirmationRate = totalCandidates === 0 ? 0 : (confirmedCandidates / totalCandidates) * 100;
    
        res.status(200).json({ 
          totalCandidates,
          confirmedCandidates,
          confirmationRate: confirmationRate.toFixed(2)
        });
      } catch (error) {
        res.status(500).json({ message: 'Error calculating confirmation rate', error: error.message });
      }
};

const Allmentors = async (req, res) => {
  try {
    const mentors = User.find({ role: 'Mentor' }).select('-password phoneNumber ');
    if (mentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found' });
    }

    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }

};



module.exports = { Totalmentors, GetFormationscount, GetCurrentFormationscount, GetFormations, Confirmationrate, Allmentors };
