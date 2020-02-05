const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    bio: String,
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    insta: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required:true,
    },

}, {
    timestamps: true,
});

module.exports = model('User', UserSchema);