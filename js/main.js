var taskText = document.getElementById('task-text');
var incompleteTaskHolder = document.getElementById('incomplete-task');
var addTaskButton = document.getElementById("add-task");
var count;
var xhr = new XMLHttpRequest();

addTaskButton.addEventListener('click', addTask);

function createNewTaskElement(taskString, parent_id) {
    var list = document.createElement('ul');
    var listItem = document.createElement("li");
    var label = document.createElement("label");

    label.innerText = taskString;
    label.setAttribute('contentEditable', 'true');

    listItem.appendChild(label);
    bindTaskEvents(listItem);
    list.appendChild(listItem);
    if (parent_id) {
        list.dataset.parentId = parent_id;
        list.dataset.id = count++;
    }
    addTaskToDB(taskString, parent_id);
    return list;
}

function addTask() {
    var taskName = 'CustomTask';
    if (taskText.value) {
        taskName = taskText.value;
    }

    var listItem = createNewTaskElement(taskName);
    listItem.dataset.id = count++;
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
        console.log(taskListItem.parentNode.dataset.id);
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

    xhr.open("GET", '/getAllTasks', true);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // if (!parent_id) {
    //     parent_id = 0;
    // }
    xhr.send();
    count = xhr.response;
    console.log(xhr.responseText);
}, false);