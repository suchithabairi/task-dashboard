let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;

// Save
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const deadline = document.getElementById("deadline").value;

    if (text === "") return;

    tasks.push({
        text,
        deadline,
        completed: false
    });

    document.getElementById("taskInput").value = "";
    document.getElementById("deadline").value = "";

    saveTasks();
    renderTasks();
}

// Render Tasks
function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let completedCount = 0;

    tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.className = "task";

        const info = document.createElement("div");
        info.className = "task-info";

        const text = document.createElement("span");
        text.innerText = task.text;

        if (task.completed) {
            text.classList.add("completed");
            completedCount++;
        }

        text.onclick = () => toggleTask(index);

        const date = document.createElement("span");
        date.className = "deadline";
        date.innerText = task.deadline || "No deadline";

        info.appendChild(text);
        info.appendChild(date);

        const del = document.createElement("button");
        del.className = "delete-btn";
        del.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm4 0A.5.5 0 0 1 10 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1z"/>
        </svg>
        `;
        del.onclick = () => deleteTask(index);

        div.appendChild(info);
        div.appendChild(del);

        list.appendChild(div);
    });

    // Stats
    document.getElementById("total").innerText = tasks.length;
    document.getElementById("completed").innerText = completedCount;
    document.getElementById("pending").innerText = tasks.length - completedCount;

    updateChart(completedCount);
}

// Toggle
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Chart
function updateChart(completed) {
    const pending = tasks.length - completed;

    if (chart) chart.destroy();

    const ctx = document.getElementById("chart");

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#22c55e", "#ef4444"]
            }]
        }
    });
}

renderTasks();