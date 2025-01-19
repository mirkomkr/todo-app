function Todolist () {
  const todos = [] // Array to hold todo items
  let ultodo, input, btnAll, btnTodo, btnCompleted

  // Load todos from localStorage
  const loadTodosFromLocalStorage = () => {
    const localTodos = localStorage.getItem('todos')
    if (localTodos) {
      const todoArr = JSON.parse(localTodos)
      if (Array.isArray(todoArr)) {
        todos.length = 0 // Clear existing todos
        todos.push(...todoArr) // Push all todos to the array
      }
    }
  }

  // Save todos to localStorage
  const saveTodosToLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }

  // Remove a todo item by its id
  const removeTodo = (id) => {
    const liToRemove = document.querySelector(`#todo-${id}`)
    if (liToRemove) {
      ultodo.removeChild(liToRemove) // Remove it from the DOM
    }
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.splice(index, 1) // Remove the todo from the array
      saveTodosToLocalStorage() // Save the updated list
    }
  }

  // Toggle the completion status of a todo
  const toggleTodo = (id, ele) => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed // Toggle completion status
      saveTodosToLocalStorage() // Save changes

      // Update the DOM element's class for visual feedback
      ele.classList.toggle('completed')
      ele.classList.toggle('uncompleted')
      ele.parentNode.classList.toggle('completed')
    }
  }

  // Create a new list item (li) element for a todo
  const createLi = ({ text, completed, id }) => {
    const li = document.createElement('li')
    li.id = `todo-${id}`
    if (completed) {
      li.classList.add('completed')
    }

    const spancheck = document.createElement('span')
    spancheck.classList.add(completed ? 'completed' : 'uncompleted')

    const spancross = document.createElement('span')
    spancross.classList.add('cross')
    spancross.addEventListener('click', () => removeTodo(id))
    spancheck.addEventListener('click', (e) => toggleTodo(id, e.target))

    const textNode = document.createTextNode(text)

    li.appendChild(spancheck)
    li.appendChild(textNode)
    li.appendChild(spancross)
    return li
  }

  // Add a new todo to the list
  const addNewTodo = (todo) => {
    todos.unshift(todo) // Add to the beginning of the array
    saveTodosToLocalStorage() // Save the new list
    const li = createLi(todo)
    ultodo.insertBefore(li, ultodo.firstChild) // Insert at the top of the list
  }

  // Handle adding a todo via the input field (on keyup event)
  const addTodo = (e) => {
    if (e.key === 'Enter' && e.target.value.trim().length > 2) {
      const newId = todos.length > 0
        ? Math.max(...todos.map(t => t.id)) + 1
        : 0
      const todo = {
        text: e.target.value.trim(),
        id: newId,
        completed: false,
      }
      addNewTodo(todo)
      e.target.value = '' // Clear input field
    }
  }

  // Render the todos based on the selected type (all, completed, uncompleted)
  const renderTodos = (todoType) => {
    ultodo.innerHTML = '' // Clear the current list
    const filteredTodos = todos.filter(todo => {
      if (todoType === 'all') return true
      return todoType === 'completed' ? todo.completed : !todo.completed
    })

    filteredTodos.forEach(todo => {
      const li = createLi(todo)
      ultodo.appendChild(li)
    })
  }

  // Toggle button classes (active state and disabled state)
  const toggleBtnClasses = (target, btns = []) => {
    target.classList.add('active')
    target.setAttribute('disabled', true)

    btns.forEach(btn => {
      btn.removeAttribute('disabled')
      btn.classList.remove('active')
    })
  }

  // Add event listeners to buttons for filtering todos
  const addListeners = () => {
    btnAll = document.querySelector('#btnAll')
    btnCompleted = document.querySelector('#btnCompleted')
    btnTodo = document.querySelector('#btnTodo')

    // Set event listeners for filtering todos
    btnAll.addEventListener('click', (e) => {
      toggleBtnClasses(e.target, [btnTodo, btnCompleted])
      renderTodos('all')
    })

    btnCompleted.addEventListener('click', (e) => {
      toggleBtnClasses(e.target, [btnAll, btnTodo])
      renderTodos('completed')
    })

    btnTodo.addEventListener('click', (e) => {
      toggleBtnClasses(e.target, [btnAll, btnCompleted])
      renderTodos('uncompleted')
    })
  }

  // Initialize the todo list, load from storage, and set up event listeners
  const renderTodoList = () => {
    loadTodosFromLocalStorage() // Load todos from localStorage
    ultodo = document.querySelector('ul#todolist')
    if (!ultodo) {
      ultodo = document.createElement('ul')
      ultodo.id = 'todolist'
      document.body.appendChild(ultodo)
    }
    renderTodos('all') // Render all todos initially

    input = document.querySelector('#todo')
    if (!input) {
      input = document.createElement('input')
      input.id = 'todo'
      input.name = 'todo'
      input.placeholder = 'What do you need to do?'
      document.body.insertBefore(input, ultodo)
    }
    input.addEventListener('keyup', addTodo) // Add todo when user presses 'Enter'
  }

  return {
    getTodos: function () {
      return todos
    },

    init: function () {
      renderTodoList() // Render the list and set up everything
      addListeners() // Add event listeners for buttons
    },
  }
}

// Create a new Todo list instance and initialize it
const myTodo = Todolist()
myTodo.init()
