const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task");
const prioritySelect = document.getElementById("priority");

// Add a task
addTaskButton.addEventListener("click", () => {
  const task = taskInput.value;
  const priority = prioritySelect.value;
  if (task) {
    const taskItem = document.createElement("div");
    taskItem.className = `task ${
      priority === "high" ? "high-priority" : "normal-priority"
    }`;
    taskItem.innerHTML = `<span>${task}</span> <button class="delete-task"><i class="fas fa-times"></i></button>`;
    taskList.appendChild(taskItem);
    taskInput.value = "";
    saveTasks();
  }
});

// Remove a task
taskList.addEventListener("click", (e) => {
  if (e.target.closest(".delete-task")) {
    e.target.closest(".task").remove();
    saveTasks();
  }
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [...taskList.children].map((task) => ({
    text: task.querySelector("span").innerText,
    priority: task.classList.contains("high-priority") ? "high" : "normal",
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  savedTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = `task ${
      task.priority === "high" ? "high-priority" : "normal-priority"
    }`;
    taskItem.innerHTML = `<span>${task.text}</span> <button class="delete-task"><i class="fas fa-times"></i></button>`;
    taskList.appendChild(taskItem);
  });
};

/* Pomodoro Timer Logic */
let timerInterval;
let timeLeft = 1500; // 25 minutes in seconds
const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-timer");
const resetButton = document.getElementById("reset-timer");

function startTimer() {
  if (timerInterval) return; // Avoid starting multiple intervals
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Time's up! Take a break.");
      notifyUser("Pomodoro Complete!", "It's time to take a break.");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

startButton.addEventListener("click", startTimer);

resetButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 1500;
  updateTimerDisplay();
});

// Notification Functionality
function notifyUser(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}

// Request Notification Permission on Page Load
window.onload = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};
