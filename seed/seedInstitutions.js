require("dotenv").config();

const mongoose = require("mongoose");
const Institution = require("../models/institution");

const institutions = [
    {
        name: "Gujarat Technological University",
        shortName: "GTU",
        city: "Ahmedabad",
        state: "Gujarat",
        type: "Engineering",
        isVerified: true
    },
    {
        name: "LD College of Engineering",
        shortName: "LDCE",
        city: "Ahmedabad",
        state: "Gujarat",
        type: "Engineering",
        isVerified: true
    },
    {
        name: "Government Engineering College, Gandhinagar",
        shortName: "GEC Gandhinagar",
        city: "Gandhinagar",
        state: "Gujarat",
        type: "Engineering",
        isVerified: true
    },
    {
        name: "Vishwakarma Government Engineering College",
        shortName: "VGEC",
        city: "Ahmedabad",
        state: "Gujarat",
        type: "Engineering",
        isVerified: true
    },
    {
        name: "L. E. College",
        shortName: "LE College",
        city: "Morbi",
        state: "Gujarat",
        type: "Engineering",
        isVerified: true
    }
];

async function seedInstitutions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected");

        for (const institution of institutions) {
            await Institution.updateOne(
                { name: institution.name },
                { $setOnInsert: institution },
                { upsert: true }
            );
        }

        console.log("Institutions seeded successfully!");

        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {

        console.error("Error seeding institutions:", error);

        process.exit(1);
    }
}

seedInstitutions();