const express = require('express')
const app = express()
const mongoose = require('mongoose');

app.use('/', express.static('../build'))

app.use('/api/v1/taskboard', require("./endpoints"));

mongoose.connect(`mongodb://localhost:27017/taskboard`);
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});
mongoose.Promise = global.Promise;

app.listen(1000, () => console.log('TaskBoard on port 1000!'))