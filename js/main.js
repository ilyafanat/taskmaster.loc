var taskText = document.getElementById('task-text');
var incompleteTaskHolder = document.getElementById('incomplete-task');
var addTaskButton = document.getElementById("add-task");

addTaskButton.addEventListener('click', addTask);

function createNewTaskElement(taskString) {
    var list = document.createElement('ul');
    var listItem = document.createElement("li");
    var label = document.createElement("label");

    label.innerText = taskString;
    label.setAttribute('contentEditable', 'true');

    listItem.appendChild(label);
    bindTaskEvents(listItem);
    list.appendChild(listItem);
    addTaskToDB(taskString);
    return list;
}

function addTask() {
    var taskName = 'CustomTask';
    if (taskText.value) {
        taskName = taskText.value;
    }

    var listItem = createNewTaskElement(taskName);
     incompleteTaskHolder.appendChild(listItem);
    // bindTaskEvents(listItem);
}

function bindTaskEvents(taskListItem) {
    var addButton = document.createElement("button");
    var deleteButton = document.createElement("button");

    addButton.innerText = "Add Sub Task";
    addButton.className = "add-task";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    deleteButton.addEventListener('click', event => taskListItem.parentNode.removeChild(taskListItem));

    addButton.addEventListener('click', event => {
        taskListItem.appendChild(createNewTaskElement('new task'))
    });

    taskListItem.appendChild(addButton);
    taskListItem.appendChild(deleteButton);
}

function addTaskToDB(text) {

    var xhr = new XMLHttpRequest();

    xhr.open("POST", '/addTask', true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('name=' + text);
}