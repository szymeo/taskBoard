var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

var express = require('express');
var router = express.Router();

var Task = require('./models/Task');
var Board = require('./models/Board');

var upload = multer({ dest: '../uploads/' })

router.post("/image",upload.single('image'), function (req, res) {
    var port = '';
    if(req.socket.localPort) {
        port = ":"+req.socket.localPort;
    }
    res.send({
        url: req.protocol + "://"+req.hostname + port + req.originalUrl+"/"+req.file.filename
    });
});

router.get("/image/:imagePath", function (req, res) {
    var img = fs.readFileSync('../uploads/'+req.params.imagePath.replace(/\W+/g, ""));
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(img, 'binary');
})

router.put('/board/:boardId', (req, res) => {
    Board.findOne({_id: req.params.boardId}).exec((err, board) => {
        if(err || !board) {
            return console.error(err);
        }

        board.title = req.body.title;
        board.tasks = req.body.tasks;

        board.save((err) => {
            res.send(board);
        })
    })
})

router.get('/performers', (req, res) => {
    res.send([{
        "_id" : "574e9686eeffa45717deed1e",
        "email" : "szymon@foo.pl",
        "isAdmin" : true
    },{
        "_id" : "574e9686eeffa45717dced1e",
        "email" : "some@foo.pl",
        "isAdmin" : false
    }])
})

router.post('/board', (req, res) => {
    var board = new Board({
        title: "New board",
        primaryColor: 'rgb(62, 93, 120)',
        cols: [{
            title: 'Whatever',
            type: 'text',
            unique: true
        },{
            title: 'Performer',
            type: 'performer',
            unique: true
        },{
            title: 'Deadline',
            type: 'date',
            unique: false
        },{
            title: 'Priority',
            type: 'priority',
            unique: true
        },{
            title: 'Status',
            type: 'status',
            unique: true
        }]
    })

    board.save((err) => {
        err ? res.send(err).status(403) : res.send(board).status(200);
    })
})

String.prototype.ucFirst = function() {
    var firstLetter = this.substr(0, 1);
    return firstLetter.toUpperCase() + this.substr(1);
}

router.post('/task/:boardId', (req, res) => {
    Board.findOne({_id: req.params.boardId}).exec((err, board) => {
        var task = new Task({
            createdAt: new Date(),
            columns: []
        }), temp = {};

        for(var i = 0; i < board.cols.length; i++) {
            temp = {};
            temp[board.cols[i].type] = {
                title: board.cols[i].title,
                type: board.cols[i].type, // !todo in future more cell types
                value: board.cols[i].type == "text" ? req.body.text : ''
            };

            task.columns.push(temp);
        }

        task.save((err) => {
            err ? res.send(err).status(401) : '';
        })

        board.tasks.push(task._id);
    
        board.save((err) => {
            err ? res.send(err).status(403) : res.send(task);
        })
    })
})

router.put('/task/:boardId', (req, res) => {

})

router.get('/')

router.get('/', (req, res) => {
    var _this = this;
    Board.find({}).populate('tasks').exec((err, boards) => {
        res.send({
            boards:boards,
            "someboards":[{
                "Sprint 1 - done": {
                    "primaryColor":'rgb(162, 93, 220)',
                    "tasks":[{
                        text: 'build brand new car', title: "bmw", deadline: "12/12/2020"
                    },{
                        text: 'build brand new car', title: "google", deadline: "12/12/2020"
                    },{
                        text: 'build brand new car', title: "yahoo", deadline: "12/12/2020"
                    },{
                        text: 'build brand new car', title: "microsoft", deadline: "12/12/2020"
                    }]
                }
            },{
                "Sprint 2 - aktualnie": {
                    "primaryColor":'rgb(226, 68, 92)',
                    "tasks":[{
                        text: 'build brand new car', title: "bmw", deadline: "12/12/2020"
                    },{
                        text: 'build brand new car', title: "google", deadline: "12/12/2020"
                    },{
                        text: 'build brand new car', title: "yahoo", deadline: "12/12/2020"
                    },{
                        text: 'build brand new car', title: "microsoft", deadline: "12/12/2020"
                    }]
                }
            }]
        });
    })
    // res.send({
        
    // });
})

module.exports = router;