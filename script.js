// Select DOM Elements
const taskForm = document.getElementById('task-form');
const taskTable = document.getElementById('task-table');
const themeToggle = document.getElementById('theme-toggle');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const searchBar = document.getElementById('search-bar');
const sortTasksButton = document.getElementById('sort-tasks');

// Local Storage Key
const STORAGE_KEY = 'todoTasks';

// Initialize Tasks Array
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Functions
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks(filter = '') {
    taskTable.innerHTML = '';
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(filter.toLowerCase()));

    filteredTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.classList.toggle('overdue', new Date(task.dueDate) < new Date() && !task.completed);

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.priority}</td>
            <td>${task.dueDate}</td>
            <td>${task.completed ? 'Yes' : 'No'}</td>
            <td>
                <button onclick="toggleComplete(${index})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </td>
        `;

        taskTable.appendChild(row);
    });

    updateProgress();
}

function addTask(event) {
    event.preventDefault();

    const name = document.getElementById('task-name').value;
    const dueDate = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    tasks.push({ name, dueDate, priority, completed: false });
    saveTasks();
    renderTasks();

    taskForm.reset();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-date').value = task.dueDate;
    document.getElementById('task-priority').value = task.priority;

    deleteTask(index);
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    progressBar.value = progress;
    progressPercentage.textContent = `${Math.round(progress)}%`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function sortTasks() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    saveTasks();
    renderTasks();
}

// Event Listeners
taskForm.addEventListener('submit', addTask);
themeToggle.addEventListener('click', toggleTheme);
sortTasksButton.addEventListener('click', sortTasks);
searchBar.addEventListener('input', () => renderTasks(searchBar.value));

// Initial Render
renderTasks();
