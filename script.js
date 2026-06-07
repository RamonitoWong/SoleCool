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

let stretchSeconds = 180;
let stretchInterval = null;
let snoozeTimeout = null;
let idleMode = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startStretchTimer() {
  if (idleMode) {
    alert("Idle Mode is on. Stretch reminders are paused.");
    return;
  }

  clearInterval(stretchInterval);
  stretchSeconds = 180;

  document.getElementById("stretchTimer").innerText = formatTime(stretchSeconds);
  document.getElementById("stretchMessage").innerHTML = "Stretch session started.<br>Keep going!";

  stretchInterval = setInterval(() => {
    stretchSeconds--;
    document.getElementById("stretchTimer").innerText = formatTime(stretchSeconds);

    if (stretchSeconds <= 0) {
      clearInterval(stretchInterval);
      document.getElementById("stretchMessage").innerHTML = "Stretch complete!<br>Good job.";
      alert("Stretch completed!");
    }
  }, 1000);
}

function stopStretchTimer() {
  clearInterval(stretchInterval);
  stretchSeconds = 180;

  document.getElementById("stretchTimer").innerText = "03:00";
  document.getElementById("stretchMessage").innerHTML =
    "Stretch stopped.<br>You can restart anytime.";
}

function snoozeReminder() {
  if (idleMode) {
    alert("Idle Mode is on. Snooze reminder will not run.");
    return;
  }

  clearTimeout(snoozeTimeout);

  const snoozeMinutes = Number(document.getElementById("snoozeTime").value);

  document.getElementById("stretchMessage").innerHTML =
    `Reminder snoozed for ${snoozeMinutes} min.`;

  snoozeTimeout = setTimeout(() => {
    if (!idleMode) {
      document.getElementById("stretchMessage").innerHTML =
        "Time to stretch again!<br>You’ve been standing for too long.";

      alert("Reminder: Time to stretch again!");
    }
  }, snoozeMinutes * 60 * 1000);
}

function toggleIdleMode() {
  idleMode = document.getElementById("idleMode").checked;

  if (idleMode) {
    clearTimeout(snoozeTimeout);
    clearInterval(stretchInterval);

    document.getElementById("stretchMessage").innerHTML =
      "Idle Mode is on.<br>Reminders are paused.";
  } else {
    document.getElementById("stretchMessage").innerHTML =
      "Idle Mode is off.<br>Stretch reminders are active.";
  }
}
