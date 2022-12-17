const mongoose = require('mongoose');

const lockSchema = new mongoose.Schema({
    lockId: {type: String, required:true},
    password: {type: String, required: true}
}, {versionKey: false})

const teacherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    key: [{type: String, required: true}]
}, {versionKey: false})

Locker = mongoose.model('person', lockSchema);
Teacher = mongoose.model('stickers', teacherSchema);

module.exports = {Locker, Teacher}
