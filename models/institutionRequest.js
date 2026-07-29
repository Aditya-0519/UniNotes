const mongoose = require("mongoose");

const institutionRequestSchema = new mongoose.Schema({

    requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

    name: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    state: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        default: "",
        maxlength: 300
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "InstitutionRequest",
    institutionRequestSchema
);