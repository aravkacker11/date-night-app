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

function loadNote() {
  const saved = localStorage.getItem("sharedNote");
  if (saved) document.getElementById("notes").value = saved;
}
