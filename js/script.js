// status bilgisini gösteren toast message hatalı çalışıyor.
// Tasarım responsive hale getirilebilir.
// Sayfa üzerindeki elementlere ulaşmak için değişkene aktar. Code okuması daha da kolaylaşır.
// https://stackoverflow.com/questions/7372038/is-there-any-way-to-change-input-type-date-format

"use strict";

//Method 1
let taskList = localStorage.getItem('taskList') ? JSON.parse(localStorage.getItem('taskList')) : [];

// Temporal ArrayList
// let taskList = [];
/* Method 2
if(localStorage.getItem('taskList') != null) {
    taskList = JSON.parse(localStorage.getItem('taskList'));
} */

let editId;
let isEditTask = false;
let displayFilterStatus = 'all';

const BTN_ALL_TASKS = document.querySelector('#btnAllTasks');
const BTN_COMPLETED_TASKS = document.querySelector('#btnCompletedTasks');
const BTN_PENDING_TASKS = document.querySelector('#btnPendingTasks');
const BTN_ADD_NEW_TASK = document.querySelector('#btnAddNewTask');
const BTN_CANCEL = document.querySelector('#btnCancel');
const BTN_CLEAR = document.querySelector('#btnClear');

const TASK_TITLE = document.querySelector('#taskTitle');
const DUE_DATE = document.querySelector('#dateInput');
const TASK_DESCRIPTION = document.querySelector('#description');

const SNACKBAR = document.querySelector('#snackbar');
const TOAST_MESSAGE = document.querySelector('#toastMessage');
const EDIT_MODE = document.querySelector('#editMode');

// Set Time Function
function doTime() {
const NOW = new Date();
const HOURS = NOW.getHours();
const MINUTES = NOW.getMinutes();
const SECOND = NOW.getSeconds();

const CURRENT = document.querySelector('#current');
CURRENT.innerHTML = `${HOURS}:${MINUTES}:${SECOND}`;
}
setInterval(doTime, 1000);
displayTasks();


// Close Toast Message Function
function closeToastMessage(event) {
    SNACKBAR.classList.remove("visible");
    event.preventDefault();
}

// Display All Task Function
function displayTasks() {
    let list = document.querySelector('#task-list');
    list.innerHTML = "";
    for (let index of taskList) {
        if(displayFilterStatus == index.status || displayFilterStatus == 'all') {
        let task = `<li class="task list-group-item">
                        <div id="taskContainer${index.id}" class="task-container">

                            <div id= "card${index.id}"class="task-completed-card">
                                <span>Task Completed</span>
                            </div>

                            <label for="${index.id}">${index.taskName}</label>
                            <label for="${index.id}">${index.dueDate}</label>
                            <label for="${index.id}">${index.description}</label>
                        <div class="button-container">
                            <button class="btn btn-success" type="button" id="btnUpdateStatus" onclick="updateStatus(${index.id})">
                                <i class="fa-solid fa-clipboard-check"></i>
                            </button>
                            <button class="btn btn-primary" type="button" id="updateTask" onclick='editTask("${index.id}", "${index.taskName}", "${index.dueDate}", "${index.description}")'>
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-danger" type="button" id="deleteTask" onclick="deleteTask(${index.id})">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    </li>`;
                    list.insertAdjacentHTML("beforeend", task);
        }
        if(index.status == 'completed') {
            let labels = document.querySelectorAll(`label[for="${index.id}"]`);
            for (let i=0; i < labels.length; i++) {
                labels[i].classList.add('completed');
            }
            document.querySelector(`div[id="card${index.id}"]`).classList.add('display');
            document.querySelector(`div[id="taskContainer${index.id}"]`).classList.add('completed-card-border');
        }
        else {
            let labels = document.querySelectorAll(`label[for="${index.id}"]`);
            for (let i=0; i < labels.length; i++) {
                labels[i].classList.remove('completed');
            }
            document.querySelector(`div[id="card${index.id}"]`).classList.remove('display');
            document.querySelector(`div[id="taskContainer${index.id}"]`).classList.remove('completed-card-border');
        }
    }   
}

// Add New Tasks Function
BTN_ADD_NEW_TASK.addEventListener('click', addNewTask); 
function addNewTask(event) {
    let taskTitle = TASK_TITLE.value;
    let dueDate = DUE_DATE.value;
    let taskDescription = TASK_DESCRIPTION.value;
    /*  let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        let currentDay = new Date().getDate(); */

    let temp = DUE_DATE.value.split("-");
    let date = `${temp[2]}.${temp[1]}.${temp[0]}`;

    if(taskTitle == "") {
        TOAST_MESSAGE.innerHTML = "Please enter the task title.";
        SNACKBAR.classList.add("visible");
    }
    else if(dueDate == "") {
        TOAST_MESSAGE.innerHTML = "Please enter the due date.";
        SNACKBAR.classList.add("visible");
    }
    else{
     if(isEditTask){
        for(let index of taskList) {
            if(index.id == editId) {
                index.taskName = TASK_TITLE.value;
                index.dueDate = date;
                index.description = TASK_DESCRIPTION.value;
            }
        }
        EDIT_MODE.classList.remove('display');
        isEditTask = false;
        displayTasks();
        localStorage.setItem('taskList', JSON.stringify(taskList));
    }
    else {
        taskList.push({"id" : taskList.length + 1, "taskName" : taskTitle, "dueDate" : date, "description" : taskDescription, "status" : "pending"});
        displayTasks();
        localStorage.setItem('taskList', JSON.stringify(taskList));

        TOAST_MESSAGE.innerHTML = "Task saved.";
        SNACKBAR.classList.add("visible");
    }
}
    TASK_TITLE.value = "";
    DUE_DATE.value = "";
    TASK_DESCRIPTION.value = "";
    event.preventDefault();
}

// Cancel Button Function
BTN_CANCEL.addEventListener('click', cancelTask);
function cancelTask() {
    TASK_TITLE.value = '';
    DUE_DATE.value = '';
    TASK_DESCRIPTION.value = '';

    EDIT_MODE.classList.remove('display');
}

// Clear All Tasks
BTN_CLEAR.addEventListener('click', clearAllTasks);
function clearAllTasks(){
    taskList.splice(0, taskList.length);
    displayTasks();
    localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Delete Selected Task
function deleteTask(id) {
    let deletedId;
    for (let index in taskList) {
        if(taskList[index].id == id) {
            deletedId = index;
        }
    }
    taskList.splice(deletedId, 1);
    displayTasks();
    localStorage.setItem('taskList', JSON.stringify(taskList));

    TOAST_MESSAGE.innerHTML = "The selected task has been deleted.";
    SNACKBAR.classList.add("visible");
}

// Update Task Function
function editTask(taskId, taskName, dueDate, taskDescription) {
    isEditTask = true;
    editId = taskId;
    
    let temp = dueDate.split(".");
    let date = `${temp[2]}-${temp[1]}-${temp[0]}`;

    TASK_TITLE.value = taskName;
    DUE_DATE.value = date;
    TASK_DESCRIPTION.value = taskDescription;

    TASK_TITLE.focus();
    TASK_TITLE.classList.add("active");

    EDIT_MODE.classList.add('display');

    TOAST_MESSAGE.innerHTML = `${taskName} isimli görev düzenleniyor.`;
    SNACKBAR.classList.add("visible");
}

// Update Status Function
function updateStatus(taskId) {
    let selectedTask = taskId;
    for (let index of taskList) {
        if(index.id == selectedTask) {
            if(index.status == 'pending') {
                index.status = 'completed';              
                TOAST_MESSAGE.innerHTML = `${index.taskName} is marked as ${index.status}.`;
                SNACKBAR.classList.add("visible");
                }
                else if(index.status == 'completed') {
                    index.status = 'pending';    
                    TOAST_MESSAGE.innerHTML = `${index.taskName} is marked as ${index.status}.`;
                    SNACKBAR.classList.add("visible");
                }
        }
    }
    displayTasks(); 
    localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Filter Button process
BTN_ALL_TASKS.addEventListener('click', function(){
    BTN_ALL_TASKS.classList.add('btn-success');
    BTN_COMPLETED_TASKS.classList.remove('btn-success');
    BTN_PENDING_TASKS.classList.remove('btn-success');

    displayFilterStatus = 'all';
    displayTasks();
    localStorage.setItem('taskList', JSON.stringify(taskList));
});

BTN_COMPLETED_TASKS.addEventListener('click', function(){
    BTN_COMPLETED_TASKS.classList.add('btn-success');
    BTN_ALL_TASKS.classList.remove('btn-success');
    BTN_PENDING_TASKS.classList.remove('btn-success');

    displayFilterStatus = 'completed';
    displayTasks();
    localStorage.setItem('taskList', JSON.stringify(taskList));
});
BTN_PENDING_TASKS.addEventListener('click', function(){
    BTN_PENDING_TASKS.classList.add('btn-success');
    BTN_COMPLETED_TASKS.classList.remove('btn-success');
    BTN_ALL_TASKS.classList.remove('btn-success');

    displayFilterStatus = 'pending';
    displayTasks();
    localStorage.setItem('taskList', JSON.stringify(taskList));
});
