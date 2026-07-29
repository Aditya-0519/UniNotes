


const mongoose = require("mongoose");
const Comment = require("./comment");

const contributionSchema = new mongoose.Schema(
{
    contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 1000
    },

    subject: {
        type: String,
        required: true,
        trim: true
    },

    courseCode: {
    type: String,
    trim: true,
    uppercase: true
},

    branch: {
        type: String,
        trim: true
    },

    semester: {
    type: Number,
    required: true,
    min: 1,
    max: 10
},

    files: [
        {
            url: {
                type: String,
                required: true
            },

            fileName: {
                type: String,
                required: true
            },

            fileType: {
                type: String,
                required: true
            },

            size: {
                type: Number,
                default: 0
            }
        }
    ],

    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],

    visibility: {
        type: String,
        enum: ["public", "college_only"],
        default: "public"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    stats: {
    views: {
        type: Number,
        default: 0
    }
},

likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],

comments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
],

},
{
    timestamps: true
});

contributionSchema.index({
    institution: 1,
    subject: 1,
    semester: 1
});

contributionSchema.index({
    status: 1,
    visibility: 1
});

contributionSchema.index({
    title: "text",
    description: "text",
    subject: "text",
    courseCode: "text",
    tags: "text"
});


contributionSchema.set("toJSON", { virtuals: true });
contributionSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Contribution", contributionSchema);