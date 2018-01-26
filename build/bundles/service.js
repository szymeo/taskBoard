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
                body: boardObj
            })
            .then(res => res.json())
            .catch(error => reject('Error:', error))
            .then(response => setTimeout(() => resolve(response), 1000));
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
            tables += this.buildBoard(board, index);
        })

        this.interface.innerHTML = tables;
    }

    buildBoard(board, boardIndex) {
        const [boardTitle] = Object.keys(board);
        let thRow = this.buildTHead(board[boardTitle].tasks[0], boardTitle, boardIndex, board[boardTitle].primaryColor);
        let tdRows = this.buildTBody(board[boardTitle].tasks, board[boardTitle].primaryColor);
        return `<section class="board" data-id="${boardIndex}">
                    <table cellspacing="1" data-id="${boardIndex}">${thRow}${tdRows}</table>
                </section>`
    }

    buildTBody(tasks, primaryColor) {
        var tdRows = ``, row = ``, firstCellStyle = `<div class="row-select" style="background-color:${primaryColor}"></div>`, i = 0;

        tasks.map((task) => {
            i = 0;
            for(var k in task) {
                row += `
                    <td>
                        ${i == 0 ? firstCellStyle : ''}
                        <span ${i == 0 ? 'class="left"' : ''}>${task[k]}</span>
                    </td>
                `;
                i++;
            }
            tdRows += `<tr>${row}</tr>`;
            row = ``;
        })

        return tdRows;
    }

    buildTHead(headings, boardTitle, boardIndex, primaryColor) {
        var thCells = ``, i = 0;
        for(var k in headings) {
            if(k === "text") thCells += `<th class="board-title">
                <h4>
                    <input type="text" style="color: ${primaryColor}" id="update-board-title" placeholder="Board title" maxlength="50" data-board="${boardTitle.hashCode()}" value="${boardTitle}" oninput='eventHandler.updateBoardTitle("${boardTitle}", this.value, ${boardIndex})' spellcheck="false" />
                </h4>
            </th>`
        else
            thCells += `<th><input type="text" data-board="${boardTitle.hashCode()}" data-header="${i}" oninput='eventHandler.updateBoardHeader("${k}", this.value, ${boardIndex})' value="${k}" spellcheck="false" /></th>`
            i++;
        }
        return `<tr>${thCells}</tr>`
    }
}

class EventsService {
    constructor(boards, api) {
        this.api = api;
        this.boards = boards;
    }

    updateBoardTitle(oldTitle, newTitle, boardIndex) {
        newTitle = newTitle.replace(/([\\\"])/g, '');
        const thisInput = document.querySelector(`table[data-id="${boardIndex}"] th > h4 > input`);
        newTitle.length <= 0 ? newTitle = `Board_title_${boardIndex}` : '';
        thisInput.setAttribute('oninput',  `eventHandler.updateBoardTitle("${newTitle}", this.value, ${boardIndex})`);
        var newBoard = this.renameKeys(this.boards[boardIndex], {[oldTitle || "key"]:newTitle});
        this.boards[boardIndex] = JSON.parse(JSON.stringify(newBoard));
        this.boards[boardIndex].title = newTitle;
        this.api.updateBoard(this.boards[boardIndex]);
        
        document.querySelector('demo-out').innerHTML = JSON.stringify(this.boards, null, 10);
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



