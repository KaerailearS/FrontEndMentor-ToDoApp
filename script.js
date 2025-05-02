// global variables, elements etc. at the top
const todoInput = document.getElementById("todo__input");
const form = document.getElementById("todo__form");
const todoList = document.getElementById("todo__list");
const filterButtons = document.querySelectorAll(".todo__filter-button");
const clearCompletedButton = document.querySelector(
  ".todo__clear-completed-button"
);
const themeToggleButton = document.querySelector(".todo__theme-toggle-button");
const themeIcon = document.getElementById("theme-icon");

let draggedItem = null;

// check localSTorage for theme preference on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeIcon.src = "./images/icon-sun.svg";
  themeIcon.alt = "Switch to light mode";
}
// the base function for adding todos; reads inputted text, adds it as a new todo line
function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText) {
    const todoItem = document.createElement("li");
    todoItem.setAttribute("draggable", "true");
    todoItem.classList.add("todo__item");
    todoItem.innerHTML = `
      <input type="checkbox" class="todo__checkbox"/>
      <span class="todo__text">${todoText}</span>
      <button class="todo__delete-button">X</button>
    `;
    todoList.appendChild(todoItem);
    todoInput.value = "";
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const todoText = document.getElementById("todo__input").value.trim("");
  if (todoText !== "") {
    addTodo(todoText);
  }
});

// allows user to add todo by pressing "Enter"
todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});

// marking todos as complete
todoList.addEventListener("change", function (e) {
  if (e.target.classList.contains("todo__checkbox")) {
    const todoItem = e.target.closest(".todo__item");
    todoItem.classList.toggle("todo__item--completed");
  }
});

// delete button functionality
todoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("todo__delete-button")) {
    const todoItem = e.target.closest(".todo__item");
    todoItem.remove();
  }
});

// filter button functionality - all/active/completed, depending on which is chosen. removes active class from any, and adds it back to the chosen one.
filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) =>
      btn.classList.remove("todo__filter-button--active")
    );
    button.classList.add("todo__filter-button-active");

    const filter = button.textContent.toLowerCase();
    filterTodos(filter);
  });
});

// filtering function itself. using a switch/case for determining what to show and when
function filterTodos(filter) {
  const todos = document.querySelectorAll(".todo__item");
  todos.forEach((todo) => {
    todo.classList.remove("hidden");

    const isCompleted = todo.classList.contains("todo__item--completed");

    switch (filter) {
      case "all":
        break;
      case "active":
        if (isCompleted) todo.classList.add("hidden");
        break;
      case "completed":
        if (!isCompleted) todo.classList.add("hidden");
        break;
    }
  });
}

// clear completed todos button
clearCompletedButton.addEventListener("click", function () {
  const completedTodos = document.querySelectorAll(".todo__item--completed");
  completedTodos.forEach((todo) => todo.remove());
});

// theme selector button
themeToggleButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeIcon.src = "./images/icon-sun.svg";
  } else {
    themeIcon.src = "./images/icon-moon.svg";
  }
});

//drag & drop functionality
todoList.addEventListener("dragstart", function (e) {
  if (e.target.classList.contains("todo__item")) {
    draggedItem = e.target;
    e.target.classList.add("draggong");
  }
});

todoList.addEventListener("dragend", function (e) {
  if (draggedItem) {
    draggedItem.classList.remove("dragging");
    draggedItem = null;
  }
});

todoList.addEventListener("dragover", function (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoList, e.clientY);
  if (afterElement == null) {
    todoList.append(draggedItem);
  } else {
    todoList.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo__item:not(.dragging)"),
  ];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, {offset: Number.NEGATIVE_INFINITY}
).element;
}
todoList.addEventListener("dragleave", function (e) {
  const draggingOverItem = e.target.closest(".todo__item");
  if (draggingOverItem) {
    draggingOverItem.style.borderTop = "";
  }
});

todoList.addEventListener("drop", function (e) {
  e.preventDefault();
  const draggingOverItem = e.target.closest(".todo__item");
  if (draggingOverItem && draggedItem !== draggingOverItem) {
    todoList.insertBefore(draggedItem, draggingOverItem);
    draggingOverItem.style.borderTop = "";
  }
});
