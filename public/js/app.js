// window가 로드되면 해야할일
// server를 통해 DB에서 코드를 가져온다.
// server와 통신을 위해서 fetch()함수를 이용해서 작성하자.
// 첫번째인수로는 HTTP로 연결을 요청할 주소를 적어주자.
// 두번째인수로는 옵션을 적어주자.

// 어디에 데이터를 가져올것인가?
// 데이터를 가져오려면 어떠한 식을 작성해야하는가? -> Promise : 비동기 상태와 처리결과를 관리하는 객체
// fetch(API)를 이용해 값을가져온다.Todos => 결국에 dataBase에서 값을 받아와야하는구나.
// 그렇게 받아온 데이터들을 render 시켜 주어야한다.
// render에서 todos가 map을 사용할수 없는 이유가 무엇일까? -> return을 안해줘서..
// then에서 console.log()를 찍게되면 처리결과값을 다음으로 넘겨주게되는데 그때 console.log()자체를 todos로 넘겨주니까 되지 않는다.
// todos는 각각의 상태가 있다. 즉, ALL, active, completed로 3가지 상태를 가지게 되는데 이때 상태를 확인해줄 변수하나를 만든다.
// nav 안에 있는 li들을 클릭했을때 이벤트가 발생하므로 이벤트위임을 받을 상위DOM객체를 만든다.
// nav를 클릭하면 nav안에 모든 클래스를 지우고 다시 내가 클릭하는 객체에게 클래스를 추가한다.
// 랜더 함수 이전에 filter를 통해 내가 가져온 배열을 상태변수에 따라서 각각 출력한다.
// 배열의 true로 평가되는 값들을 completed와 active에 넣어준다.
// 일단 그럼 이제 키보드 이벤트를 통해서 내가 쓴 input 값을 입력해서 넣어보자.
// 내가 input에 입력한 값을  $todos에 추가 시키기

// 서버에서 받아온 데이터를 담아줄 배열
let todos = [];
// 상태변수
let navState = 'all';

//DOMs
const $todos = document.querySelector('.todos');
const $nav = document.querySelector('.nav');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.getElementById('ck-complete-all');
const $btn = document.querySelector('.btn');

// const get = (url) => {
//   return new Promise((resolve, rejected) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.send();

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         resolve(JSON.parse(xhr.response));
//       } else {
//         rejected(console.error(xhr.status));
//       }
//     };
//   });
// };

const render = () => {
  // render 함수 내에서 문자열을 받아줄 변수
  let html = '';
  // todosFilter 변수로는 todos 배열을 filter해서 true로 평가된 값을 가져온다.
  const todosFilter = todos.filter((todo) =>
    navState === 'completed' ? todo.completed : navState === 'active' ? !todo.completed : true
  );

  // 위에서 처리된 todosFilter변수에 담긴 값을 가지고 렌더링 하겠다.
  todosFilter
    .map((todo) => {
      html += `<li id="${todo.id}" class="todo-item">
      <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}>
      <label for="ck-${todo.id}">${todo.content}</label>
      <i class="remove-todo far fa-times-circle"></i>
      </li>`;
    })
    .join('');
  // console.log($todos.innerHTML);

  $todos.innerHTML = html;
  $completedTodos.textContent = todos.filter((todo) => todo.completed).length;
  $activeTodos.textContent = todos.filter((todo) => !todo.completed).length;
};

// 서버에서 초기에 GET 방식으로 가져올정보들
const fetchTodos = () => {
  fetch('/todos')
    .then((res) => res.json())
    .then((_todos) => {
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};

// window가 로드되면 fetchTodos 함수의 식별자를 전달.
window.onload = fetchTodos;

$inputTodo.onkeyup = (e) => {
  // Enter키가 아니면 막기
  if (e.key !== 'Enter') return;

  // addTodo
  const addTodo = {
    // todos배열의 길이 값이 음수가 아니면 투두스의 아이디 값 중 가장 큰값 +1 아니면  1
    id: todos.length ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1,
    content: $inputTodo.value,
    completed: false,
  };

  fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(addTodo),
  })
    .then((res) => res.json())
    .then((resTodos) => {
      todos = resTodos;
    })
    .then(render)
    .catch(console.error);

  $inputTodo.value = '';
  // fetchAPI 를 사용해서 HTTP 응답요청을 받을꺼다.a
  // 방식은 POST방식,
  // 제목은 ~~
  // body에는 전달될 페이로드의 값을 쥐어준다.active
  // then에서는 응답되고 나서의 일들을 적어준다.
  // 응답 객체를 parse할것이고,
  // 기존 todos에 응답된 resTodo를 할당해준다.
  // 그리고 그것을 가지고 render 한다.
  // catch에서는 than안에서의 오류와 더불어 모든 오류를 잡아낸다.
};

// nav를 클릭하면 할동작
$nav.onclick = (e) => {
  if (!e.target.matches('.nav > li')) return;
  document.querySelector('.active').classList.remove('active');
  e.target.classList.add('active');
  navState = e.target.id;
  // console.log(navState);
  render();
};

$todos.onchange = (e) => {
  // 서버에게 변경된 값을 전달후 받아와서 다시 렌더링.
  const { id } = e.target.parentNode;

  fetch(`/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: e.target.checked }),
  })
    .then((res) => res.json())
    .then((_todos) => {
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};

$completeAll.onchange = (e) => {
  if (!e.target.matches('.complete-all > .checkbox')) return;
  fetch('/todos/completed', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: e.target.checked }),
  })
    .then((res) => res.json())
    .then((_todos) => {
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};

$btn.onclick = (e) => {
  fetch('todos/completed', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true }),
  })
    .then((res) => res.json())
    .then((_todos) => {
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};

$todos.onclick = (e) => {
  if (!e.target.matches('.remove-todo')) return;
  fetch(`/todos/${e.target.parentNode.id}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((_todos) => {
      console.log(_todos);
      todos = _todos;
    })
    .then(render)
    .catch(console.error);
};
