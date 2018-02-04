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

    get getPerformers() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}performers`, {
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
    constructor(element, data, performers) {
        this.interface = element;
        this.interfaceData = data;
        this.performers = performers;

        this.cellsData = {
            performers: this.performers
        }
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

    buildBoard(board) {
        let thRow = this.buildTHead(board.cols, board);
        let tdRows = this.buildTBody(board.tasks, board);
        return `<section class="board" data-id="${board._id}">
                    <table cellspacing="1" data-id="${board._id}">${thRow}${tdRows}</table>
                </section>`
    }

    refetchBoard(boardId) {
        var board = document.querySelector(`section.board[data-id="${boardId}"]`);
        var thisBoard = this.interfaceData.find((board) => { return board._id == boardId });
        let thRow = this.buildTHead(thisBoard.cols, thisBoard);
        let tdRows = this.buildTBody(thisBoard.tasks, thisBoard);

        board.innerHTML = `<table cellspacing="1" data-id="${board._id}">${thRow}${tdRows}</table>`;
    }

    buildTBody(tasks, board) {
        
        var tdRows = ``, 
            row = ``, 
            firstCellStyle = `<div class="row-select" style="background-color:${board.primaryColor}"></div>`,
            i = 0,
            addNewTask = `<tr class="add-new-task"><td>
                    ${firstCellStyle}
                    <span class="left">
                        <input type="text" style="color: ${board.primaryColor}" id="new-task-text" placeholder="Add new task (row)" maxlength="50" data-board="${board._id.hashCode()}" spellcheck="false" />
                    </span>
                </td>
                ${this.fillBetweenCells(board.cols.length - 2)}
                <td class="action-btn">
                    <button class="btn font-w-400 darkness-purple" onclick='eventHandler.addTask("${board._id}")'>Add</button>
                </td>
            </tr>`;
        if(tasks.length <= 0) return addNewTask;

        tasks.map((task) => {
            i = 0;
            for(var i = 0; i < board.cols.length; i++) {
                row += `<td>
                            ${i == 0 ? firstCellStyle : ''}
                            <span ${i == 0 ? 'class="left"' : ''}>${this.getCell(task, board.cols, i)}</span>
                        </td>`
            }
            tdRows += `<tr>${row}</tr>`;
            row = ``;
        })

        return `${tdRows}${addNewTask}`;
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
                thCells += `<th><input type="text" data-board="${board._id.hashCode()}" data-header="${i}" oninput='eventHandler.updateBoardHeader(this.value, "${board._id}")' value="${headings[i].title}" spellcheck="false" /></th>`
            }
        }
        return `<tr>${thCells}</tr>`
    }

    fillBetweenCells(colCount) {
        this.out = ``;
        for(var i = 0; i < colCount; i++) {
            this.out += `<td><div></div></td>`
        }
        return this.out;
    }

    getCell(task, headings, index) {
        const cell = task.columns.find((cell) => {
            [this.first] = Object.keys(cell);
            return this.first === headings[index].type;
        })[headings[index].type];

        const cellTypes = {
            date: `<input id="date" type="date" value="${cell.value}">`,
            performer: `<select onchange="eventHandler.changeTaskPriority()">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>`,
            text: `${cell.value}`,
            priority: `<select onchange="eventHandler.changeTaskPriority()">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>`,
            status: `<select onchange="eventHandler.changeTaskPriority()">
                        <option value="high">Todo</option>
                        <option value="medium">Working on it</option>
                        <option value="low">Done</option>
                    </select>`,
        }

        return cellTypes[cell.type];
    }
}

class EventsService {
    constructor(boards, api, interfaceService) {
        this.api = api;
        this.interface = interfaceService;
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
        var thisBoard = this.boards.find((board) => { return board._id == boardId });

        taskText.length > 0 ? this.api.addTask(boardId, taskText)
        .then((task) => {
            thisBoard.tasks.push(task);
            this.interface.refetchBoard(thisBoard._id);
        }) : '';
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
        _this.performers = await apiService.getPerformers;
        _this.interface = new InterfaceService(taskboard, _this.boards['boards'], _this.performers);
        window.eventHandler = new EventsService(_this.boards['boards'], apiService, _this.interface);
        // document.querySelector('demo-out').innerHTML = JSON.stringify(_this.boards['boards'], null, 10);
        // taskboard.innerHTML = '';
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



