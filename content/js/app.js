const todoInput = document.querySelector(".todo-input");
const btnEl = document.querySelector(".btn");
const listEl = document.querySelector(".list");
const sectionEl = document.querySelector("select");

const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const searchData = document.querySelector(".search-data");

const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
const completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

const updateLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
};

const addTodo = (todoText, completed = false) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add(
    "todo",
    "sm:w-[280px]",
    "max-sm:w-[200px]",
    "w-[150px]",
    "h-[50px]",
    "bg-pink-500",
    "rounded-full",
    "mt-5",
    "flex",
    "mx-8"
  );

  let newLi = document.createElement("li");
  newLi.innerText = todoText;
  newLi.classList.add("item", "pt-3", "pl-5", "flex-1");
  newDiv.appendChild(newLi);

  const buttonEl = document.createElement("button");
  buttonEl.innerHTML = '<i class="fas fa-check-circle pl-3"></i>';
  buttonEl.classList.add(
    "complete-btn",
    "float-right",
    "pr-2",
    "text-pink-500",
    "bg-pink-100",
    "h-full"
  );
  newDiv.appendChild(buttonEl);

  const trashEl = document.createElement("button");
  trashEl.innerHTML = '<i class="fas fa-trash px-3"></i>';
  trashEl.classList.add(
    "trash-btn",
    "float-right",
    "pr-2",
    "text-pink-500",
    "bg-gray-400",
    "h-full"
  );
  newDiv.appendChild(trashEl);

  let editEl = document.createElement("button");
  editEl.innerHTML = '<i class="fas fa-edit px-3"></i>';
  editEl.classList.add(
    "edit-btn",
    "float-right",
    "pr-2",
    "text-pink-500",
    "bg-gray-400",
    "h-full",
  );
  newDiv.appendChild(editEl);

  if (completed) {
    newDiv.classList.add("completed");
    newLi.style.textDecoration = "line-through";
    newLi.style.opacity = "0.5";
  }

  listEl.appendChild(newDiv);
};

const saveTodo = () => {
  updateLocalStorage();
};



searchBtn.addEventListener("click", (event) => {
  event.preventDefault();

  addTodoItem();
});

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    addTodoItem();
  }
});

function addTodoItem() {
  searchBox.classList.add("active");
  searchBtn.classList.add("active");
  todoInput.classList.add("active");
  cancelBtn.classList.add("active");
   searchData.classList.add("active");
  todoInput.focus();

  if (todoInput.value !== "") {
    searchData.classList.remove("active");

    const newTodoText = todoInput.value;
    const isDuplicate = savedTodos.some((todo) => todo.text === newTodoText);
    if (!isDuplicate) {
      addTodo(newTodoText);
      savedTodos.push({ text: newTodoText, completed: false });
      saveTodo();
    }

    todoInput.value = "";
  } else {
    searchData.textContent = "";
  }
}

savedTodos.forEach((todo) => {
  addTodo(todo.text, todo.completed);
});


listEl.addEventListener("click", (e) => {
  e.preventDefault()
  const clickedElement = e.target;

  if (clickedElement.closest(".complete-btn")) {
    const todoDiv = clickedElement.closest(".todo");
    todoDiv.classList.toggle("completed");
    const todoText = todoDiv.querySelector(".item");
    todoText.style.textDecoration = todoDiv.classList.contains("completed")
      ? "line-through"
      : "none";
    todoText.style.opacity = todoDiv.classList.contains("completed") ? "0.5" : "1";

    const todoIndex = savedTodos.findIndex((item) => item.text === todoText.innerText);
    if (todoIndex !== -1) {
      savedTodos[todoIndex].completed = !savedTodos[todoIndex].completed;
      saveTodo();
    }
  }

  if (clickedElement.closest(".trash-btn")) {
    const todoDiv = clickedElement.closest(".todo");
    const todoText = todoDiv.querySelector(".item").innerText;
    const todoIndex = savedTodos.findIndex((item) => item.text === todoText);
    if (todoIndex !== -1) {
      savedTodos.splice(todoIndex, 1);
      saveTodo();
    }
    todoDiv.remove();
  }

  if (clickedElement.closest(".edit-btn")) {
    const todoDiv = clickedElement.closest(".todo");
    const todoText = todoDiv.querySelector(".item").innerText;

    const editInput = document.createElement("input");
    editInput.className = "edit-input , text-black , rounded-bl-full , rounded-tl-full , p-3";
    editInput.value = todoText;
    
    todoDiv.querySelector(".item").replaceWith(editInput);

    const saveButton = document.createElement("button");
    saveButton.innerHTML = '<i class="fas fa-save px-3"></i>';
    saveButton.classList.add("save-btn", "float-right", "pr-2", "text-pink-500", "bg-gray-400", "h-full", "rounded-br-full", "rounded-tr-full");
    todoDiv.appendChild(saveButton);

    clickedElement.remove();

    saveButton.addEventListener("click", () => {
      const updatedTodoText = editInput.value;
      const newLi = document.createElement("li");
      newLi.innerText = updatedTodoText;
      newLi.classList.add("item", "pt-3", "pl-5", "flex-1");
      todoDiv.querySelector(".edit-input").replaceWith(newLi);
      todoDiv.querySelector(".save-btn").remove();
      let editEl = document.createElement("button");
      editEl.innerHTML = '<i class="fas fa-edit px-3"></i>';
      editEl.classList.add(
        "edit-btn",
        "float-right",
        "pr-2",
        "text-pink-500",
        "bg-gray-400",
        "h-full",
      );
      todoDiv.appendChild(editEl);

      const todoIndex = savedTodos.findIndex((item) => item.text === todoText);
      if (todoIndex !== -1) {
        savedTodos[todoIndex].text = updatedTodoText;
        saveTodo();
      }
    });
  }
});


sectionEl.addEventListener("change", () => {
  const selectedOption = sectionEl.value;
  const todoItems = listEl.querySelectorAll(".todo");

  todoItems.forEach((item) => {
    if (selectedOption === "all") {
      item.style.display = "flex";
    } else if (selectedOption === "completed" && item.classList.contains("completed")) {
      item.style.display = "flex";
    } else if (selectedOption === "incomplete" && !item.classList.contains("completed")) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});
