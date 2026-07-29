const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    shortName: {
        type: String,
        trim: true
    },

    city: {
        type: String,
        trim: true
    },

    state: {
        type: String,
        trim: true
    },

    website: {
        type: String,
        default: ""
    },

    logo: {
        type: String,
        default: ""
    },

    type: {
        type: String,
        enum: [
            "Engineering",
            "Medical",
            "Commerce",
            "Arts",
            "Law",
            "Science",
            "Other"
        ],
        default: "Engineering"
    },

    isVerified: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

institutionSchema.index({
    name: "text",
    shortName: "text"
});

institutionSchema.index({
    city: 1,
    state: 1
});

module.exports = mongoose.model("Institution", institutionSchema);