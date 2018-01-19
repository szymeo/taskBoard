class taskboardService {
    constructor(url) {
        this.apiUrl = url;
    }
    
    getTasks() {
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
    constructor(element, tasks) {
        this.interface = element;
        this.tasks = tasks;
    }

    buildTaskTable() {
        let table = document.createElement("table");
        var header = table.createTHead(), body = table.createTBody();
        this.interface.appendChild(table);
        var headRow, bodyRow, i = 0, rowCount = 0;

        this.tasks.map((task) => {
            headRow = header.insertRow(rowCount);
            bodyRow = body.insertRow(rowCount);
            rowCount++;
            for(var k in task) {
                headRow.insertCell(i).innerHTML = k;
                bodyRow.insertCell(i).innerHTML = task[k];
                i++;
            }
            i = 0;
        })
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
        _this.tasks = await service.getTasks();
        taskboard.innerHTML = '';
        _this.interface = new interfaceService(taskboard, _this.tasks);
        _this.interface.buildTaskTable();
    }();
})();



