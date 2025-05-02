addButton = document.getElementById('add-todo');
addButton.addEventListener('click', addTodo);

function addTodo(){
  const todoContainer = document.getElementById('main-todo-container');
  const todoItem = document.createElement('div');

  todoItem.classList.add('todo-item');

  if(todoContainer.children.length%2===0){
    todoItem.classList.add('todo-even');
  } else{
    todoItem.classList.add('todo-odd');
  }

  todoItem.textContent = `To-Do ${todoContainer.children.length + 1}`;
  
  todoContainer.appendChild(todoItem);
}