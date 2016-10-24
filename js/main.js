var taskText = document.getElementById('task-text');
var incompleteTaskHolder = document.getElementById('incomplete-task');
var addTaskButton = document.getElementById("add-task");
var count;
var xhr = new XMLHttpRequest();

addTaskButton.addEventListener('click', addTask);

function createNewTaskElement(task) {
    var list = document.createElement('ul');
    var listItem = document.createElement("li");
    var label = document.createElement("label");

    label.innerText = task.name;
    label.setAttribute('contentEditable', 'true');

    listItem.appendChild(label);
    bindTaskEvents(listItem);
    list.appendChild(listItem);
    //if (parent_id) {
    list.dataset.parentId = task.parent_id;
    list.dataset.id = task.id;
    //}
    //addTaskToDB(taskString, parent_id);
    return list;
}

function addTask() {
    var taskName = 'CustomTask';
    if (taskText.value) {
        taskName = taskText.value;
    }

    var listItem = createNewTaskElement(taskName);
    //listItem.dataset.id = count++;
    incompleteTaskHolder.appendChild(listItem);
    // bindTaskEvents(listItem);
}

function bindTaskEvents(taskListItem) {
    var addButton = document.createElement("button");
    var deleteButton = document.createElement("button");

    addButton.innerText = "Add Sub Task";
    addButton.className = "add-task";
    // addButton.dataset.parentId = ;
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    deleteButton.addEventListener('click', event => taskListItem.parentNode.removeChild(taskListItem)
)
    ;

    addButton.addEventListener('click', event => {
        //console.log(taskListItem.parentNode.dataset.id);
        taskListItem.appendChild(createNewTaskElement('new subtask', taskListItem.parentNode.dataset.id))
})
    ;

    taskListItem.appendChild(addButton);
    taskListItem.appendChild(deleteButton);
}

function addTaskToDB(text, parent_id) {
    xhr.open("POST", '/addTask', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (!parent_id) {
        parent_id = 0;
    }
    xhr.send('name=' + text + "&parent_id=" + parent_id);
}

document.addEventListener('DOMContentLoaded', function () {
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var tasks = xhr.response;
            var c
            tasks.forEach(function (item, count) {
                createTree(item);
            });
        }
    };
    xhr.open("GET", '/getAllTasks', true);
    xhr.responseType = 'json';
    xhr.send();

}, false);

function createTree(item) {
    if (item.parent_id == 0) {
        incompleteTaskHolder.appendChild(createNewTaskElement(item));
    } else {
        var elem = document.querySelectorAll("[data-id='" + item.parent_id + "']");
        console.log("[data-id='" + item.parent_id + "']");
        elem.appendChild(createNewTaskElement(item));
    }
}