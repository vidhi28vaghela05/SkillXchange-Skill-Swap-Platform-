const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillxchange');
    
    await User.deleteMany({});
    
    const users = [
      {
        name: "Alice Smith",
        email: "alice@example.com",
        password: "password123",
        skillsOffered: ["React", "CSS", "UI Design"],
        skillsWanted: ["Node.js", "Python"]
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        skillsOffered: ["Node.js", "MongoDB", "Python"],
        skillsWanted: ["React", "UI Design"]
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "password123",
        skillsOffered: ["Marketing", "SEO"],
        skillsWanted: ["React", "Node.js"]
      }
    ];

    await User.create(users);
    console.log("Sample data seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
