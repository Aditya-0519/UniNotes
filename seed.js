const mongoose = require('mongoose');
const Institution = require('./models/institution');
const User = require('./models/user');
const Contribution = require('./models/contribution');

mongoose.connect('mongodb://127.0.0.1:27017/UniNotes');

const seedDB = async () => {
  await Institution.deleteMany({});
  await User.deleteMany({});
  await Contribution.deleteMany({});

  // Create some colleges
  const iitb = await Institution.create({
    name: "Indian Institute of Technology Bombay",
    shortName: "IITB",
    city: "Mumbai",
    state: "Maharashtra",
    isVerified: true
  });

  const nitk = await Institution.create({
    name: "National Institute of Technology Karnataka",
    shortName: "NITK",
    city: "Surathkal",
    state: "Karnataka",
    isVerified: true
  });

  console.log('✅ Institutions seeded');

  // You can add sample users and contributions later
  console.log('Database seeded successfully!');
  process.exit();
};

seedDB();