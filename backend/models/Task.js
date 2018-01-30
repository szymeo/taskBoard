var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    columns: [],
    createdAt: Date,
    files: []
});

module.exports = mongoose.model('Task', taskSchema);