var taskList = document.getElementById("tasklist");

var data = (localStorage.getItem('todo'))
    ? JSON.parse(localStorage.getItem('todo'))
    : { tasks: [] };

if (data.tasks.length >  0) {
    for (var i = 0; i < data.tasks.length; i++) {
        updateTaskList(data.tasks[i]);
    }
}

document.getElementById('add-task-button').addEventListener('click', function() {
    let input = document.getElementById('add-task-input');
    var value = input.value;
    if (value)
    {
        appendTask(value);
        input.value = '';
    }
});

function updateTaskList(text)
{
    let taskItem = document.createElement('li');

    let content = document.createElement('div');
    content.classList.add('task-content');

    let taskText = document.createElement('span');
    taskText.innerText = text;

    content.appendChild(taskText);
    taskItem.appendChild(content);

    let buttons = document.createElement('div');
    buttons.classList.add('buttons');
    
    let editButton = document.createElement('button');
    editButton.classList.add('edit', 'material-icons-outlined');
    editButton.innerText = 'edit';
    editButton.addEventListener('click', editTask);

    let removeButton = document.createElement('button');
    removeButton.classList.add('remove', 'material-icons-outlined');
    removeButton.innerText = 'delete';
    removeButton.addEventListener('click', removeTask);
    
    buttons.appendChild(editButton);
    buttons.appendChild(removeButton);
    taskItem.appendChild(buttons);
    
    taskList.insertBefore(taskItem, taskList.childNodes[0]);
}

function appendTask(text) {
    updateTaskList(text);
    data.tasks.push(text);
    updateStorage();
}

function editTask()
{
    let task = this.parentNode.parentNode;
    let taskContent = task.getElementsByClassName('task-content')[0];
    let taskText = taskContent.getElementsByTagName('span')[0];
    let taskButtons = task.getElementsByClassName('buttons')[0];
    
    taskText.classList.add('hidden');
    
    let input = document.createElement('input');
    input.placeholder = taskText.innerText;
    taskContent.appendChild(input);

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel', 'material-icons-outlined');
    cancelButton.innerText = 'clear';
    cancelButton.addEventListener('click', cancelChanges);
    
    let saveButton = document.createElement('button');
    saveButton.classList.add('save', 'material-icons-outlined');
    saveButton.innerText = 'done';
    saveButton.addEventListener('click', saveChanges);

    taskButtons.insertBefore(cancelButton, taskButtons.childNodes[0]);
    taskButtons.insertBefore(saveButton, taskButtons.childNodes[0]);
    this.remove();
}

function cancelChanges()
{
    let task = this.parentNode.parentNode;
    restoreFromEdit(task);
}

function saveChanges() {
    let task = this.parentNode.parentNode;
    let parent = task.parentNode;
    let taskContent = task.getElementsByClassName('task-content')[0];
    let taskText = taskContent.getElementsByTagName('span')[0];
    let input = task.getElementsByTagName('input')[0];
    let value = (input.value.length != 0) ? input.value : taskText.innerText;

    data.tasks[getTaskIndex(task)] = value;
    updateStorage();
    taskText.innerText = value;
    restoreFromEdit(task);
}

function restoreFromEdit(task)
{
    let taskContent = task.getElementsByClassName('task-content')[0];
    let taskText = taskContent.getElementsByTagName('span')[0];
    let taskButtons = task.getElementsByClassName('buttons')[0];

    taskText.classList.remove('hidden');

    let editButton = document.createElement('button');
    editButton.classList.add('edit', 'material-icons-outlined');
    editButton.innerText = 'edit';
    editButton.addEventListener('click', editTask);

    taskContent.getElementsByTagName('input')[0].remove();
    taskButtons.getElementsByClassName('save')[0].remove();
    taskButtons.getElementsByClassName('cancel')[0].remove();
    taskButtons.insertBefore(editButton, taskButtons.childNodes[0]);
}

function removeTask()
{
    let task = this.parentNode.parentNode;
    data.tasks.splice(getTaskIndex(task), 1);
    updateStorage();
    taskList.removeChild(task);
}

function getTaskIndex(task) {
    let index = Array.prototype.indexOf.call(task.parentNode.children, task);
    return task.parentNode.children.length - index - 1;
}

function updateStorage()
{
    localStorage.setItem('todo', JSON.stringify(data));
}