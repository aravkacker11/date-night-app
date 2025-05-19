window.onload = () => {
  if (document.getElementById("canvas")) setupCanvas();
  if (document.getElementById("prompt")) fetchPrompt();
  if (document.getElementById("notes")) loadNote();
};

function setupCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.addEventListener("mousedown", () => (drawing = true));
  canvas.addEventListener("mouseup", () => (drawing = false));
  canvas.addEventListener("mouseout", () => (drawing = false));
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  });
}

function clearCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function saveDrawing() {
  const canvas = document.getElementById("canvas");
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = image;
  link.click();
}

function fetchPrompt() {
  fetch("http://localhost:5000/api/prompt")
    .then(res => res.json())
    .then(data => {
      document.getElementById("prompt").textContent = "Prompt: " + data.prompt;
    })
    .catch(err => console.error("Failed to load prompt", err));
}

function saveNote() {
  const content = document.getElementById("notes").value;
  localStorage.setItem("sharedNote", content);
  alert("Note saved locally!");
}

// ========== CLOCK ==========
function updateClocks() {
  const ny = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const lon = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  document.getElementById("nyc-time").textContent = new Date(ny).toLocaleTimeString();
  document.getElementById("london-time").textContent = new Date(lon).toLocaleTimeString();
}
if (document.getElementById("nyc-time")) {
  updateClocks();
  setInterval(updateClocks, 1000);
}

// ========== TO-DO ==========
function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  if (!task) return;

  const li = document.createElement("li");
  li.textContent = task;
  li.onclick = () => {
    li.classList.toggle("done");
    saveTasks();
  };
  document.getElementById("taskList").appendChild(li);
  input.value = "";

  saveTasks();
}

function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => ({
    text: li.textContent,
    done: li.classList.contains("done")
  }));
  localStorage.setItem("todoList", JSON.stringify(tasks));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("todoList")) || [];
  data.forEach(({ text, done }) => {
    const li = document.createElement("li");
    li.textContent = text;
    if (done) li.classList.add("done");
    li.onclick = () => {
      li.classList.toggle("done");
      saveTasks();
    };
    document.getElementById("taskList").appendChild(li);
  });
}
if (document.getElementById("taskList")) loadTasks();


function loadNote() {
  const saved = localStorage.getItem("sharedNote");
  if (saved) document.getElementById("notes").value = saved;
}
