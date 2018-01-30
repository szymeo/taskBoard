var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    columns: [{
        title: String,
        alias: String,
        type: String,
        value: String
    }],
    createdAt: Date,
    files: []
});

module.exports = mongoose.model('Task', taskSchema);