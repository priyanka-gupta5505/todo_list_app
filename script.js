// SELECTORS

// input field
const input = document.querySelector('#todo-content');

// add button
const submitBtn = document.querySelector('#add-todo');

// complete all todo button
const completeAll = document.querySelector('.complete-all');

// clear completed todo button
const clearCompleted = document.querySelector('.clear-completed');

// Todo container
const todoList = document.querySelector('.todo-list');

// total number of todos
const totalTodos = document.querySelector('#total');

// filter todo buttons all, uncompleted, completed
const showBtns = document.querySelectorAll('.show');



// EVENT LISTNERS

// Add todo
submitBtn.addEventListener('click', addTodo);

// Mark all todos completed
completeAll.addEventListener('click', completeAllTodo);

// Filter todos
showBtns.forEach(show => {
    show.addEventListener('click', showTodos);
});

// Delete completed todos
clearCompleted.addEventListener('click', deleteCompletedTodos);

// Fetch todos from local Storage when document is loaded
document.addEventListener("DOMContentLoaded", fetchTodos);



// FUNCTIONS

// Add new todo 
// todo and status are undefined for adding todos using form
// Reused this function for creating todos using fetched todos from locala storage 
// passing todo content and status completed or not
function addTodo(e, todo, status) {
    if (e)
        // prevent page form refreshing
        e.preventDefault();
    let value;

    if (todo) {
        // for fteched todo from localStorage
        value = todo;
    }
    else {
        // for creating todo using form
        value = input.value.trim();
    }

    // if input contains only spaces then do nothing
    if (!value) {
        input.value = '';
        return;
    }

    // Else create new div element
    const newTodo = document.createElement('div');

    // this radio is for fetched todos from localStorage 
    // it is value of checked or unchecked radio icon value for material icons
    newTodo.classList.add('op-0');

    let radio = '';

    // if staus is true 
    if (status) {
        // mark todo as completed 
        radio = 'radio_button_checked';
        // adding class completed to mark todo as comleted
        newTodo.classList.add('todo', 'd-flex', 'completed', 'op-07');
    }
    else {
        // else mark todo as uncompleted
        radio = 'radio_button_unchecked';
        newTodo.classList.add('todo', 'd-flex');
    }
    setTimeout(() => {
        newTodo.classList.remove('op-0');
        newTodo.classList.add('op-1');
    }, 1);

    // add complete, todo content and delete button to new todo
    // value is todo content 
    // radio is icon value for checked and unchecked
    newTodo.innerHTML = `
            <div class="left d-flex">
                <span class="material-icons-outlined btn complete">
                    ${radio}
                </span>

                <div class="task"> ${value}</div>
            </div>

            <span class="material-icons-outlined btn delete">
                highlight_off
            </span>
        `
    // prepending new todo to todo container
    todoList.prepend(newTodo);

    // clearing input value
    input.value = '';

    // showing count of all todos
    getAllTodos();

    // complete button of new todo
    const completeBtn = newTodo.querySelector('.complete');

    // delete button of new todo 
    const deleteBtn = newTodo.querySelector('.delete');

    // if user is creating todo the we save it to localStorage
    // else if we fetching for localStorage we will not save it
    if (!todo)
        saveTodos(newTodo);

    // add event listener for completing new todo
    completeBtn.addEventListener('click', completeTodo);

    // add event listener for deleting new todo
    deleteBtn.addEventListener('click', deleteTodo);

}

// Function for completing all todos
function completeAllTodo(e) {
    // getting all todos
    const todos = getAllTodos();

    // marking each as completed
    todos.forEach(todo => {
        todo.classList.add('completed');
        todo.querySelector('.complete').innerText = 'radio_button_checked';
        changeTodoStatus(todo);
    });
}

// Fuction for filterling todo
function showTodos(e) {

    // getting pressed action and adding active class to it
    const self = e.target;
    showBtns.forEach(show => {
        if (show == self)
            show.classList.add('active');
        else
            show.classList.remove('active');
    });

    // getting type of action
    const type = self.getAttribute('data-show');

    // getting all todos
    const todos = getAllTodos();

    // for counting no. of todos
    let count = 0;
    switch (type) {
        // showing all
        case 'all':
            todos.forEach(todo => {
                todo.style.display = 'flex';
                count += 1;
            });
            break;
        // showing uncompleted
        case 'uncompleted':
            todos.forEach(todo => {
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'none';
                } else {
                    todo.style.display = 'flex';
                    count += 1;
                }
            });
            break;
        // showing completed
        case 'completed':
            todos.forEach(todo => {
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'none';
                } else {
                    todo.style.display = 'flex';
                    count += 1;
                }
            });
            break;
    }

    // showing totoal no. of todos in each category
    totalTodos.innerHTML = count;
}

// Function to complete a single todo
function completeTodo(e) {
    // radio button
    const self = e.target;

    // getting clicked todo
    const todo = self.parentElement.parentElement;

    // toggle radio icon
    if (self.innerText == 'radio_button_unchecked')
        self.innerText = 'radio_button_checked';
    else
        self.innerText = 'radio_button_unchecked';

    // marking todo completed
    todo.classList.toggle('completed');

    // saving status of todo in localStorage
    changeTodoStatus(todo);
}

// Function to delete a todo
function deleteTodo(e) {
    // getting todo
    const todo = e.target.parentElement;

    // deleting form localStorage
    deleteTodoFromLocal(todo);

    // removing todo from page
    todo.classList.add('op-0');
    todo.classList.remove('completed');
    setTimeout(() => {
        todo.remove();
        getAllTodos();
    }, 500);
    
}

// Function to delete all completed todos
function deleteCompletedTodos(e) {
    // getting all todos
    const todos = getAllTodos();

    // deleting each completed todo from page and localStorage
    todos.forEach(todo => {
        if (todo.classList.contains('completed')) {
            deleteTodoFromLocal(todo);
            todo.classList.add('op-0');
            todo.classList.remove('completed');
            setTimeout(() => {
                todo.remove();
                getAllTodos();
            }, 500);
        }
    });

}

// Function to update count of todos and return all todos
function getAllTodos() {
    const todos = document.querySelectorAll('.todo');
    totalTodos.innerHTML = todos.length;
    return todos;
}

// Function to check saved todos in localStorage
function checkTodos() {
    let todos = localStorage.getItem('todos');
    if (!todos)
        todos = [];
    else
        todos = JSON.parse(todos);

    return todos;
}

// Function to check saved todo status in localStorage
function checkTodoStatus() {
    let completed = localStorage.getItem('completed');
    if (!completed)
        completed = [];
    else
        completed = JSON.parse(completed);

    return completed;
}

// Function to save todos in localstorage
function saveTodos(todo) {
    const task = todo.querySelector('.task').innerText;
    const todos = checkTodos();

    todos.push(task);
    localStorage.setItem('todos', JSON.stringify(todos));
    saveTodoStatus(todo);
}

// Function to save todos status in localstorage
function saveTodoStatus(todo) {
    const completed = todo.classList.contains('completed');
    const status = checkTodoStatus();

    status.push(completed);
    localStorage.setItem('completed', JSON.stringify(status));

}

// Function to change todo status in localStorage
function changeTodoStatus(todo) {
    const todos = checkTodos();
    const status = checkTodoStatus();
    const task = todo.querySelector('.task').innerText;

    const index = todos.indexOf(task);
    status[index] = todo.classList.contains('completed');
    localStorage.setItem('completed', JSON.stringify(status));
}


// Function to fetch todos form localStorage
function fetchTodos() {
    const todos = checkTodos();
    const status = checkTodoStatus();

    for (let i = 0; i < todos.length; i++) {
        addTodo(undefined, todos[i], status[i]);
    }
}

// Funtion to delete todos form localStorage
function deleteTodoFromLocal(todo) {
    const task = todo.querySelector('.task').innerText;
    const todos = checkTodos();
    const index = todos.indexOf(task);
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    deleteTodoStatus(index);
}

// Function to delete todo status form localStorage
function deleteTodoStatus(index) {
    const status = checkTodoStatus();
    status.splice(index, 1);
    localStorage.setItem('completed', JSON.stringify(status));
}