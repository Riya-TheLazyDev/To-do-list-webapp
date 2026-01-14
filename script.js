// Get logged-in user
const loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
  window.location.href = "login.html";
}

// DOM Elements
const taskContainer = document.getElementById("task-container");
const saveBtn = document.getElementById("save-task");
const searchInput = document.getElementById("search");
const todayDate = document.getElementById("today-date");

todayDate.innerText = new Date().toDateString();

// Load all tasks and filter by user
let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let tasks = allTasks.filter((t) => t.user === loggedInUser);
let editId = null;

// Render tasks
function renderTasks(filter = "active", search = "") {
  taskContainer.innerHTML = "";
  tasks.forEach((task) => {
    if (filter === "active" && task.status !== "active") return;
    if (filter === "completed" && task.status !== "completed") return;
    if (filter === "missed" && task.status !== "missed") return;
    if (
      search &&
      !task.title.toLowerCase().includes(search.toLowerCase()) &&
      !task.desc.toLowerCase().includes(search.toLowerCase())
    )
      return;

    const col = document.createElement("div");
    col.classList.add("col-md-6", "col-lg-4");

    const card = document.createElement("div");
    card.classList.add("task-card", getRandomColor());
    if (task.status === "completed") card.classList.add("completed");
    if (task.status === "missed") card.classList.add("missed");

    card.innerHTML = `
      <h6>${task.title}</h6>
      <p>${task.desc}</p>
      <small>${task.time}</small>
      <div class="task-actions">
        <button onclick="toggleComplete('${task.id}')" class="btn-complete">
          ${task.status === "completed" ? "Completed" : "Complete"}
        </button>
        <button onclick="deleteTask('${
          task.id
        }')" class="btn-delete">Delete</button>
      </div>
    `;

    col.appendChild(card);
    taskContainer.appendChild(col);
  });
  saveTasks();
}

// Random pastel colors for cards
function getRandomColor() {
  const colors = ["bg-blue", "bg-purple", "bg-yellow", "bg-pink", "bg-green"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Save tasks
function saveTasks() {
  const otherUsersTasks = allTasks.filter((t) => t.user !== loggedInUser);
  localStorage.setItem("tasks", JSON.stringify([...otherUsersTasks, ...tasks]));
}

// Add/Edit Task
saveBtn.onclick = () => {
  const title = document.getElementById("task-title").value.trim();
  const desc = document.getElementById("task-desc").value.trim();
  const time = document.getElementById("task-time").value;

  if (!title || !desc || !time) return alert("All fields are required");

  if (editId) {
    const task = tasks.find((t) => t.id === editId);
    task.title = title;
    task.desc = desc;
    task.time = time;
    editId = null;
  } else {
    tasks.push({
      id: Date.now().toString(),
      title,
      desc,
      time,
      status: "active",
      user: loggedInUser,
    });
  }

  clearModal();
  renderTasks();
  bootstrap.Modal.getInstance(document.getElementById("taskModal")).hide();
};

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}

// Toggle complete
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = task.status === "completed" ? "active" : "completed";
    renderTasks();
  }
}

// Edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  editId = id;
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.desc;
  document.getElementById("task-time").value = task.time;
  new bootstrap.Modal(document.getElementById("taskModal")).show();
}

// Clear modal inputs
function clearModal() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-desc").value = "";
  document.getElementById("task-time").value = "";
}

// Filter buttons
document.getElementById("active-btn").onclick = () =>
  renderTasks("active", searchInput.value);
document.getElementById("completed-btn").onclick = () =>
  renderTasks("completed", searchInput.value);
document.getElementById("missed-btn").onclick = () =>
  renderTasks("missed", searchInput.value);

// Search functionality
searchInput.addEventListener("input", () => {
  renderTasks("active", searchInput.value);
});

// Auto-mark missed tasks
setInterval(() => {
  const now = new Date();
  tasks.forEach((task) => {
    if (task.status === "active" && new Date(task.time) < now) {
      task.status = "missed";
    }
  });
  renderTasks("active", searchInput.value);
}, 60000);

// Update username in sidebar & Logout
document.addEventListener("DOMContentLoaded", () => {
  const appTitle = document.getElementById("app-title");
  if (appTitle) {
    appTitle.innerText = `${loggedInUser}'s HealDocs`;
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }
});

// Initial render
renderTasks();
