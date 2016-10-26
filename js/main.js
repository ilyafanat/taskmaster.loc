var taskText = document.getElementById('task-text');
var incompleteTaskHolder = document.getElementById('incomplete-task');
var addTaskButton = document.getElementById("add-task");
var xhr = new XMLHttpRequest();
var lastId = 0;
var addedTask;
window.onload = function () {
    getTasks();
};

addTaskButton.addEventListener('click', addTask);

function getTasks() {
    return new Promise(function (resolve, reject) {
        xhr.open("GET", '/task', true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var tasks = xhr.response;
            if (typeof tasks != "undefined" && tasks != null && tasks.length > 0) {
                lastId = tasks[tasks.length - 1].id;
                tasks.forEach(function (item) {
                    createTree(item);
                });
            }
            resolve();
        };
        xhr.onerror = reject;
        xhr.send();
    });
}

function createNewTaskElement(task, add) {

    if (add) {
        return render(task);
    } else {
        addTaskToDB(task, getAddedTask);
    }
}

function getAddedTask(data) {
    // console.log('otrisoval');
    if (data.parent_id === 0) {
        incompleteTaskHolder.appendChild(render(data));
    } else {
        var listItem = document.querySelector("[data-id='" + data.parent_id + "']");
        listItem.appendChild(render(data));
    }
    // render(data);
}

function render(task) {

    var list = document.createElement('ul');
    var listItem = document.createElement("li");
    var label = document.createElement("label");

    label.innerText = decodeURI(task.name);
    label.setAttribute('contentEditable', 'true');
    listItem.appendChild(label);
    listItem.dataset.parentId = task.parent_id;
    listItem.dataset.id = task.id;
    bindEditEvent(label, listItem.dataset.id);
    bindTaskEvents(listItem);
    list.appendChild(listItem);

    return list;
}

function addTask() {
    var task = {'name': 'CustomTask'};

    if (taskText.value) {
        task.name = taskText.value;
    }
    var listItem = createNewTaskElement(task);
    listItem;
}

function bindEditEvent(label, id) {
    label.addEventListener("blur", function () {
        xhr.open("PUT", '/task/' + id + '/name/' + this.textContent, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
    }, false);
}

function bindTaskEvents(taskListItem) {
    var addButton = document.createElement("button");
    var deleteButton = document.createElement("button");

    addButton.innerText = "Add Sub Task";
    addButton.className = "add-task";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    var item = {'name': 'new subtask', 'parent_id': taskListItem.dataset.id};
    deleteButton.addEventListener('click', event => {
        deleteTask(taskListItem);
        taskListItem.parentNode.removeChild(taskListItem);
    });

    addButton.addEventListener('click', event => {
        createNewTaskElement(item)
    });

    taskListItem.appendChild(addButton);
    taskListItem.appendChild(deleteButton);
}

function addTaskToDB(item, callback) {
    if (!item.parent_id) {
        item.parent_id = 0;
    }
    xhr.open("POST", '/task/' + item.name + '/parent_id/' + item.parent_id, true);
    xhr.onload = function () {
        // if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log('otrabotal');
        item.id = xhr.getResponseHeader('Location').split('/')[2];
        callback(item);
        // }
    };
    xhr.send();
}


function createTree(item) {
    if (item.parent_id == 0) {
        incompleteTaskHolder.appendChild(createNewTaskElement(item, 'no'));
    } else {
        var listItem = document.querySelector("[data-id='" + item.parent_id + "']");
        listItem.appendChild(createNewTaskElement(item, 'no'));
    }
}

function deleteTask(item) {
    xhr.open("DELETE", "/delete/" + item.dataset.id, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
}

