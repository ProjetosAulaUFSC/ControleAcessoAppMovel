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

Key = mongoose.model('Key', lockSchema);
Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = {Key, Teacher}
