console.log("TODO App is loaded!");

// Select elements
const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const clearCompletedButton = document.getElementById("clear-completed");
const todoList = document.getElementById("todo-list");
const statusMessage = document.getElementById("status-message");
const loadingIndicator = document.getElementById("loading");

// Load saved TODOs from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTodos);

// Function to display messages
function showMessage(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "red" : "green";
    setTimeout(() => { statusMessage.textContent = ""; }, 3000);
}

// Function to show/hide loading indicator
function setLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? "block" : "none";
}

// Function to load TODOs from localStorage
function loadTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todoList.innerHTML = ""; // Clear existing UI
    todos.forEach(renderTodo);
}

// Function to save TODOs to localStorage
function saveTodosToLocalStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to add a TODO via API & localStorage
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
        showMessage("Please enter a valid TODO!", true);
        return;
    }

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Prevent duplicates
    if (todos.some(todo => todo.text === todoText)) {
        showMessage("TODO already exists!", true);
        return;
    }

    const newTodo = { text: todoText, completed: false };

    todos.push(newTodo);
    saveTodosToLocalStorage(todos);

    setLoading(true);
    setTimeout(() => {
        renderTodo(newTodo);
        todoInput.value = "";
        showMessage("TODO added successfully!");
        setLoading(false);
    }, 1000);
}

// Function to render a TODO item
function renderTodo(todo) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center";

    // Checkbox for completion toggle
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.className = "me-2";
    checkbox.addEventListener("change", () => toggleComplete(todo.text, checkbox, li));

    // Editable text
    const todoText = document.createElement("span");
    todoText.textContent = todo.text;
    todoText.className = "flex-grow-1";
    if (todo.completed) {
        todoText.classList.add("text-decoration-line-through");
    }

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn btn-sm btn-warning ms-2";
    editButton.addEventListener("click", () => editTodo(todo.text, todoText));

    // Append elements
    li.appendChild(checkbox);
    li.appendChild(todoText);
    li.appendChild(editButton);
    todoList.appendChild(li);
}

// Function to toggle TODO completion and update localStorage
function toggleComplete(todoText, checkbox, li) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.map(todo => {
        if (todo.text === todoText) {
            todo.completed = checkbox.checked;
        }
        return todo;
    });

    saveTodosToLocalStorage(todos);
    li.querySelector("span").classList.toggle("text-decoration-line-through", checkbox.checked);
}

// Function to edit a TODO item
function editTodo(oldText, todoTextElement) {
    const newText = prompt("Edit TODO:", oldText);
    if (newText && newText.trim() !== "") {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];
        todos = todos.map(todo => {
            if (todo.text === oldText) {
                todo.text = newText;
            }
            return todo;
        });

        saveTodosToLocalStorage(todos);
        todoTextElement.textContent = newText;
    }
}

// Function to clear completed TODOs
function clearCompleted() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter(todo => !todo.completed);
    saveTodosToLocalStorage(todos);

    loadTodos(); // Reload list to reflect cleared items
    showMessage("Completed TODOs cleared!");
}

// Event listeners
addTodoButton.addEventListener("click", addTodo);
clearCompletedButton.addEventListener("click", clearCompleted);
todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});