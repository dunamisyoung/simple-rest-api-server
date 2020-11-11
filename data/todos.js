//DB

const todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'Javascript', completed: false },
].sort((t1, t2) => t2.id - t1.id);

// exports 수출한다(보낸다) todos파일 자체를 todos를 담아서
exports.todos = todos;
