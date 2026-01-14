const completedContainer = document.getElementById("completed-container");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderCompleted() {
  // Get logged-in user
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "login.html";
  }

  // Load all tasks
  let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filter tasks for the logged-in user
  let userTasks = allTasks.filter((task) => task.user === loggedInUser);

  // Completed Tasks
  const completedContainer = document.getElementById("completed-container");
  if (completedContainer) {
    completedContainer.innerHTML = "";
    userTasks.forEach((task) => {
      if (task.status === "completed") {
        const div = document.createElement("div");
        div.classList.add("task-card", "bg-green");
        div.innerHTML = `
                <h6>${task.title}</h6>
                <p>${task.desc}</p>
                <small>${task.time}</small>
            `;
        completedContainer.appendChild(div);
      }
    });
  }

  completedContainer.innerHTML = "";
  tasks
    .filter((t) => t.status === "completed")
    .forEach((task) => {
      const col = document.createElement("div");
      col.classList.add("col-md-6", "col-lg-4");
      const card = document.createElement("div");
      card.classList.add("task-card", "bg-green", "completed");
      card.innerHTML = `
      <h6>${task.title}</h6>
      <p>${task.desc}</p>
      <small>${task.time}</small>
    `;
      col.appendChild(card);
      completedContainer.appendChild(col);
    });
}

renderCompleted();
