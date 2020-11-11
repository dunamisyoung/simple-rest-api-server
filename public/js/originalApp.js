// States
let todos = [];
let navState = 'all';
const $nav = document.querySelector('.nav');
const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');

// const get = url => new Promise((resolve, reject) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', url);
//   xhr.send();
//   xhr.onload = () => {
//     if (xhr.status === 200) {
//       resolve(JSON.parse(xhr.response));
//     } else {
//       reject(new Error(xhr.status));
//     }
//   };
// });

const generateNextId = () => (todos.length ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1);

const render = () => {
  let html = '';
  const _todos = todos.filter((todo) =>
    navState === 'completed' ? todo.completed : navState === 'active' ? !todo.completed : true
  );

  _todos.forEach(({ id, content, completed }) => {
    html += `<li id="${id}" class="todo-item">
      <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
      <label for="ck-${id}">${content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>`;
  });

  $todos.innerHTML = html;
  $completedTodos.textContent = todos.filter((todo) => todo.completed).length;
  $activeTodos.textContent = todos.filter((todo) => !todo.completed).length;
};

const fetchTodos = () => {
  // todos = [
  //   { id: 1, content: 'HTML', completed: false },
  //   { id: 2, content: 'CSS', completed: true },
  //   { id: 3, content: 'Javascript', completed: false },
  // ];
  // render();
  // get('/todos')
  //   .then(_todos => { todos = _todos; })
  //   .then(render)
  //   .catch(console.error);
  fetch('/todos')
    .then((res) => res.json())
    .then((_todos) => {
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};

window.onload = fetchTodos;

$inputTodo.onkeyup = ({ key }) => {
  if (key !== 'Enter') return;
  const content = $inputTodo.value;
  const newTodo = { id: generateNextId(), content, completed: false };
  console.log(newTodo);

  fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    // .then(console.log)
    .then((_todos) => {
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};

$nav.onclick = ({ target }) => {
  if (!target.matches('.nav > li')) return;
  document.querySelector('.active').classList.remove('active');
  target.classList.add('active');
  navState = target.id;
  render();
};

$todos.onchange = e => {
  const { id } = e.target.parentNode;
  // console.log(id);
  // console.log(e.target.checked);
  fetch(`/todos/${id}`, {
    method: ‘PATCH’,
    headers: { ‘Content-Type’: ‘application/json’ },
    body: JSON.stringify({ completed: e.target.checked })
  })
    .then(res => res.json())
    .then(console.log)
};
