'use strict';

class TaskboardService {
    constructor(url) {
        this.apiUrl = url;
    }
    
    updateBoard(boardObj) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}board/${boardObj._id}`, {
                method: 'PUT',
                headers: new Headers({
                  'Content-Type': 'application/json'
                }),
                body: JSON.stringify(boardObj)
            })
            .then(res => res.json())
            .catch(error => reject('Error:', error))
            .then(response => setTimeout(() => resolve(response), 0));
        })
    }

    createBoard() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}board/`, {
                method: 'POST',
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
            })
            .then(res => res.json())
            .catch(error => reject('Error:', error))
            .then(response => setTimeout(() => resolve(response), 0));
        })
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
            .then(response => setTimeout(() => resolve(response), 0));
        })
    }

    addTask(boardId, taskText) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}task/${boardId}`, {
                method: 'POST',
                body: JSON.stringify({text: taskText}),
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
        if(this.interfaceData && this.interfaceData.length > 0) {
            this.interfaceData.map((board, index) => {
                tables += this.buildBoard(board, index);
            })
        } else {
            tables = ``;
        }
        

        this.interface.innerHTML = `${tables} <div class="create-board"><button onclick="eventHandler.createBoard()">Create board</button></div>`;
    }

    buildBoard(board, boardIndex) {
        let thRow = this.buildTHead(board.cols, board);
        let tdRows = this.buildTBody(board.tasks, board);
        return `<section class="board" data-id="${board._id}">
                    <table cellspacing="1" data-id="${board._id}">${thRow}${tdRows}</table>
                </section>`
    }

    buildTBody(tasks, board) {
        var tdRows = ``, row = ``, firstCellStyle = `<div class="row-select" style="background-color:${board.primaryColor}"></div>`, i = 0;
        if(tasks.length <= 0) return `<tr class="add-new-task"><td>
                        ${firstCellStyle}
                        <span class="left">
                            <input type="text" style="color: ${board.primaryColor}" id="new-task-text" placeholder="Add new task (row)" maxlength="50" data-board="${board._id.hashCode()}" spellcheck="false" />
                        </span>
                    </td>
                    <td></td>
                    <td>
                        <button style="width:10%;height:100%;border:none;" onclick='eventHandler.addTask("${board._id}")'>Add</button>
                    </td>
                </tr>`;

        console.log(board.cols);
        tasks.map((task) => {
            i = 0;
            for(var i = 0; i < board.cols.length; i++) {
                console.log(task[board.cols[i]])
                row += `
                    <td>
                        ${i == 0 ? firstCellStyle : ''}
                        <span ${i == 0 ? 'class="left"' : ''}>${task[board.cols[i]] || ''}</span>
                    </td>
                `;
            }
            tdRows += `<tr>${row}</tr>`;
            row = ``;
        })

        return tdRows;
    }

    buildTHead(headings, board) {
        var thCells = ``;
        for(var i = 0; i < headings.length; i++) {
            if(i == 0) {
                thCells += `<th class="board-title">
                    <h4>
                        <input type="text" style="color: ${board.primaryColor}" id="update-board-title" placeholder="Board title" maxlength="50" data-board="${board._id.hashCode()}" value="${board.title}" oninput='eventHandler.updateBoardTitle(this.value, "${board._id}")' spellcheck="false" />
                    </h4>
                </th>`
            } else {
                thCells += `<th><input type="text" data-board="${board._id.hashCode()}" data-header="${i}" oninput='eventHandler.updateBoardHeader(this.value, "${board._id}")' value="${headings[i]}" spellcheck="false" /></th>`
            }
        }
        return `<tr>${thCells}</tr>`
    }
}

class EventsService {
    constructor(boards, api) {
        this.api = api;
        this.boards = boards;
    }

    updateBoardTitle(newTitle, boardId) {
        var thisBoard = this.boards.find((board) => { return board._id == boardId });
        thisBoard.title = newTitle;
        this.api.updateBoard(thisBoard);
        
        document.querySelector('demo-out').innerHTML = JSON.stringify(this.boards, null, 10);
    }

    addTask(boardId) {
        var taskText = document.querySelector(`input#new-task-text[data-board="${boardId.hashCode()}"]`).value;

        this.api.addTask(boardId, taskText)
        .then(task => console.log(task));
    }

    createBoard() {
        this.api.createBoard()
        .then(board => console.log(board));
    }

    updateBoardHeader(oldHeader, newHeader) {
        newHeader = newHeader.replace(/\\/g, '');
        const thisInput = document.querySelector(`input[data-board="${oldTitle.hashCode()}"]data-header="${oldHeader.hashCode()}"`);
        thisInput.setAttribute('oninput',  `eventHandler.updateBoardHeader("${newTitle}", this.value)`);
        thisInput.dataset.board = newTitle.hashCode();
        var eventBoard = this.getBoardById(oldTitle);
        var boardIndex = this.boards.indexOf(eventBoard);
        var newBoard = this.renameKeys(eventBoard, {[oldTitle]:newTitle});
        this.boards[boardIndex] = JSON.parse(JSON.stringify(newBoard));
        
        document.querySelector('demo-out').innerHTML = JSON.stringify(this.boards, null, 10);
    }

    getBoardById(id) {
        function findBoard(board) {
            return board[id];
        }

        return this.boards.find(findBoard)
    }

    getCellById(board, id) {
        function findCell(cell) {
            return cell[id];
        }

        return this.boards[board].tasks.find(findCell);
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
        window.eventHandler = new EventsService(_this.boards['boards'], apiService);
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



