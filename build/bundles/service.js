class taskboardService {
    constructor(url) {
        this.apiUrl = url;
    }
    
    getBoards() {
        return new Promise((resolve, reject) => {
            fetch(this.apiUrl, {
                method: 'GET',
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
            })
            .then(res => res.json())
            .catch(error => reject('Error:', error))
            .then(response => setTimeout(() => resolve(response), 1000));
        })
    }

    addTask(data) {
        return new Promise((resolve, reject) => {
            fetch(this.apiUrl, {
                method: 'POST',
                body: JSON.stringify({'a':'s'}), 
                headers: new Headers({
                'Content-Type': 'application/json'
                })
            })
            .then(res => res.json())
            .catch(error => reject('Error:', error))
            .then(response => resolve(response));
        })
    }
}

class interfaceService {
    constructor(element, boards) {
        this.interface = element;
        this.boards = boards;
    }

    buildBoardsTable() {
        var tables = ``;
        this.boards.map((board, index) => {
            tables += this.buildBoard(board);
        })

        this.interface.innerHTML = tables;
    }

    buildBoard(board) {
        let thRow = this.buildTHead(board.tasks[0]);
        let tdRows = this.buildTBody(board.tasks);
        return `<table id="${board['board']}">${thRow}${tdRows}</table>`
    }

    buildTBody(tasks) {
        var tdRows = ``, row = ``;

        tasks.map((task) => {
            for(var k in task) {
                row += `<td>${task[k]}</td>`;
            }
            tdRows += `<tr>${row}</tr>`;
            row = ``;
        })

        return tdRows;
    }

    buildTHead(headings) {
        var thCells = ``;
        for(var k in headings) {
            thCells += `<th>${k}</th>`
        }
        return `<tr>${thCells}</tr>`
    }
}

(function(url) {
    var _this = this;
    const apiUrl = document.currentScript.getAttribute('apiUrl');
    const taskboard = document.querySelector('taskboard');
    const service = new taskboardService(apiUrl);

    // service.addTask()
    //     .then((data) => console.log(data))
    //     .catch((e) => console.error(e))

    var fillTasks = async function() {
        taskboard.innerHTML = "Loading...";
        _this.boards = await service.getBoards();
        taskboard.innerHTML = '';
        _this.interface = new interfaceService(taskboard, _this.boards);
        _this.interface.buildBoardsTable();
    }();
})();



