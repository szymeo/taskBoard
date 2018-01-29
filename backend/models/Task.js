var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    text: String,
    assigned: [],
    deadline: Date,
    priority: String,
    createdAt: Date,
    files: [],
    type: String
});

module.exports = mongoose.model('Task', taskSchema);