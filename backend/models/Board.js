var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
    title: String,
    primaryColor: String,
    createdAt: Date,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

module.exports = mongoose.model('Board', boardSchema);