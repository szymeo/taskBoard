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
        
    })
})

router.put('/board/:boardId', (req, res) => {
    Board.findOne({_id: req.params.boardId}).exec((err, board) => {

    })
})

router.post('/task/:boardId', (req, res) => {
    Board.findOne({_id: req.params.boardId}).exec((err, board) => {
        var task = new Task({
            board: req.body.board
        })

        task.save((err) => {
            err ? res.send(err).status(401) : res.send(task);
        })

        board.tasks.push(task._id);
    
        board.save((err) => {
            err ? res.send(err).status(403) : res.send(board);
        })
    })
})

router.put('/task/:boardId', (req, res) => {

})

router.get('/', (req, res) => {
    res.send({
        "boards":[{
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

module.exports = router;