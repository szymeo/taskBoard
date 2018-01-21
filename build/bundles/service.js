'use strict';

class TaskboardService {
    constructor(url) {
        this.apiUrl = url;
    }
    
    get getBoards() {
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

    set addTask(data) {
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

class InterfaceService {
    constructor(element, data) {
        this.interface = element;
        this.interfaceData = data;
    }

    buildBoardsTable() {
        var tables = ``;
        this.interfaceData.map((board, index) => {
            tables += this.buildBoard(board);
        })

        this.interface.innerHTML = tables;
    }

    buildBoard(board) {
        const [boardTitle] = Object.keys(board);
        let thRow = this.buildTHead(board[boardTitle].tasks[0]);
        let tdRows = this.buildTBody(board[boardTitle].tasks);
        return `<section class="board">
                    <h4>
                        <input type="text" id="update-board-title" value="${boardTitle}" oninput='eventHandler.updateBoardTitle("${boardTitle}", this.value, this)' spellcheck="false" />
                    </h4>
                    <table id="${boardTitle}">${thRow}${tdRows}</table>
                </section>`
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

class EventsService {
    constructor(boards) {
        this.boards = boards;
    }

    updateBoardTitle(oldTitle, newTitle, fallbackElem) {
        fallbackElem.setAttribute('oninput',  `eventHandler.updateBoardTitle("${newTitle}", this.value, this)`);
        var eventBoard = this.getBoardById(oldTitle);
        var boardIndex = this.boards.indexOf(eventBoard);
        var newBoard = this.renameKeys(eventBoard, {[oldTitle]:newTitle});
        this.boards[boardIndex] = newBoard;
        
        document.querySelector('demo-out').innerHTML = JSON.stringify(this.boards, null, 10);
    }

    getBoardById(id) {
        console.log(this.boards);
        function findBoard(board) {
            return board[id];
        }

        return this.boards.find(findBoard)
    }

    renameKeys(obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
          const newKey = newKeys[key] || key;
          return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }
}

(function() {
    var _this = this || {};
    const taskboard = document.querySelector('taskboard');
    const apiUrl = document.currentScript.getAttribute('apiUrl');
    const service = new TaskboardService(apiUrl);

    // service.addTask()
    //     .then((data) => console.log(data))
    //     .catch((e) => console.error(e)) 

    var fillTasks = async function() {
        taskboard.innerHTML = "Loading...";
        _this.boards = await service.getBoards;
        window.eventHandler = new EventsService(_this.boards['boards']);
        document.querySelector('demo-out').innerHTML = JSON.stringify(_this.boards['boards'], null, 10);
        taskboard.innerHTML = '';
        _this.interface = new InterfaceService(taskboard, _this.boards['boards']);
        _this.interface.buildBoardsTable();
    }();
})();



