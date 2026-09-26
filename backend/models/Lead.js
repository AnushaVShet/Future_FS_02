const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
       name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
},

       email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
    ]
},

        phone: {
            type: String,
            trim: true
        },

        company: {
            type: String,
            trim: true
        },

        source: {
    type: String,
    trim: true,
    default: "Website"
},
        status: {
            type: String,
            enum: ["new", "contacted", "converted"],
            default: "new"
        },

        notes: [
            {
                text: {
                    type: String,
                    trim: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;

