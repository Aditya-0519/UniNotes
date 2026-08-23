const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    googleId: {
    type: String,
    unique: true,
    sparse: true
},

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
    type: String,
    default: null
},

    avatar: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 200,
        default: ""
    },

    institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: function () {
        return this.role === "student";
    }
},

branch: {
    type: String,
    trim: true,
    required: function () {
        return this.role === "student";
    }
},

semester: {
    type: Number,
    min: 1,
    max: 10,
    required: function () {
        return this.role === "student";
    }
},

    contributionCount: {
        type: Number,
        default: 0
    },

    reputation: {
    type: Number,
    default: 0,
    min: 0
},

    verified: {
        type: Boolean,
        default: false
    },

    followers: {
    type: Number,
    default: 0
},

following: {
    type: Number,
    default: 0
},

totalDownloads: {
    type: Number,
    default: 0
},

totalViews: {
    type: Number,
    default: 0
},

bookmarks: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contribution"
    }
],

    role: {
        type: String,
        enum: ["student", "moderator", "admin"],
        default: "student"
    }

},
{
    timestamps: true
});

userSchema.index({
    institution: 1,
    branch: 1,
    semester: 1
});

module.exports = mongoose.model("User", userSchema);