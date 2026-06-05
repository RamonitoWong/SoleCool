let connected = true;
let standingMinutes = 272;
let alerts = 2;

function openTab(tabId, button) {
  document.querySelectorAll(".tab-page").forEach(page => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");
  button.classList.add("active");
}

function toggleConnection() {
  connected = !connected;

  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");

  if (connected) {
    text.innerText = "Connected";
    dot.style.background = "#20c45a";
  } else {
    text.innerText = "Disconnected";
    dot.style.background = "#ff3b30";
  }
}

function addStandingTime(minutes) {
  standingMinutes += minutes;

  const hours = Math.floor(standingMinutes / 60);
  const mins = standingMinutes % 60;
  const percent = Math.min(Math.round((standingMinutes / 480) * 100), 100);

  document.getElementById("standingTime").innerText = `${hours}h ${mins}m`;
  document.getElementById("goalPercent").innerText = `${percent}%`;
  document.querySelector(".bar i").style.width = `${percent}%`;
}

function showAlerts() {
  alert(
    "2 Alerts\n\n" +
    "• Standing too long\n" +
    "• High heel pressure detected"
  );
}

function updateComfortValue() {
  const slider = document.getElementById("comfortSlider");
  const value = document.getElementById("comfortValue");

  const levels = ["Very Low", "Low", "Medium", "High", "Maximum"];
  value.innerText = levels[slider.value - 1];
}

function startTherapy() {
  const level = document.getElementById("comfortValue")?.innerText || "Medium";

  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }

  alert(
    "Comfort Mode Activated\n\n" +
    `Intensity: ${level}\n` +
    "Session: 10 minutes\n" +
    "Rest: 5 minutes"
  );
}

function showPressure(side) {
  const label = document.getElementById("pressureSide");
  label.innerText = side;

  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.classList.remove("active-toggle");
  });

  document.getElementById(side.toLowerCase() + "Btn").classList.add("active-toggle");
}
