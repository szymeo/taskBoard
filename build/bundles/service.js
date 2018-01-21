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
        let thRow = this.buildTHead(board[boardTitle].tasks[0], boardTitle);
        let tdRows = this.buildTBody(board[boardTitle].tasks);
        return `<section class="board">
                    <h4>
                        <input type="text" id="update-board-title" data-board="${boardTitle.hashCode()}" value="${boardTitle}" oninput='eventHandler.updateBoardTitle("${boardTitle}", this.value)' spellcheck="false" />
                    </h4>
                    <table cellspacing="1" id="${boardTitle}">${thRow}${tdRows}</table>
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

    buildTHead(headings, boardTitle) {
        var thCells = ``;
        for(var k in headings) {
            thCells += `<th><input type="text" data-board="${boardTitle.hashCode()}" data-header="${k}" oninput='eventHandler.updateBoardHeader("${k}", this.value)' value="${k}" spellcheck="false" /></th>`
        }
        return `<tr>${thCells}</tr>`
    }
}

class EventsService {
    constructor(boards) {
        this.boards = boards;
    }

    updateBoardTitle(oldTitle, newTitle) {
        const thisInput = document.querySelector(`input[data-board="${oldTitle.hashCode()}"]`);
        thisInput.setAttribute('oninput',  `eventHandler.updateBoardTitle("${newTitle}", this.value)`);
        thisInput.dataset.board = newTitle.hashCode();
        var eventBoard = this.getBoardById(oldTitle);
        var boardIndex = this.boards.indexOf(eventBoard);
        var newBoard = this.renameKeys(eventBoard, {[oldTitle]:newTitle});
        this.boards[boardIndex] = JSON.parse(JSON.stringify(newBoard));
        
        document.querySelector('demo-out').innerHTML = JSON.stringify(this.boards, null, 10);
    }

    updateBoardHeader(oldHeader, newHeader) {

    }

    getBoardById(id) {
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
    const apiService = new TaskboardService(apiUrl);

    // service.addTask()
    //     .then((data) => console.log(data))
    //     .catch((e) => console.error(e)) 

    var fillTasks = async function() {
        taskboard.innerHTML = "Loading...";
        _this.boards = await apiService.getBoards;
        window.eventHandler = new EventsService(_this.boards['boards']);
        document.querySelector('demo-out').innerHTML = JSON.stringify(_this.boards['boards'], null, 10);
        taskboard.innerHTML = '';
        _this.interface = new InterfaceService(taskboard, _this.boards['boards']);
        _this.interface.buildBoardsTable();
    }();
})();

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};



