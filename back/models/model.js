const mongoose = require('mongoose');

const lockSchema = new mongoose.Schema({
    lockId: {type: String, required:true}
    // password: {type: String, required: true}
}, {versionKey: false})

const teacherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true}
    // key: [{type: String, required: true}]
}, {versionKey: false})

const teacherKeySchema = new mongoose.Schema({
    lockFID: {type: String, required:true},
    teacherName: {type: String, required:true},
    schedule: [{type: String, required:true}],
    accepted: {type: Boolean, required: true}
}, {versionKey: false})

Key = mongoose.model('Key', lockSchema);
Teacher = mongoose.model('Teacher', teacherSchema);
TeacherKey = mongoose.model('TeacherKey', teacherKeySchema);
module.exports = {Key, Teacher, TeacherKey}
