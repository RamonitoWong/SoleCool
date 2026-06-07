let connected = true;
let standingMinutes = 272;
let stretchSeconds = 180;
let stretchInterval = null;
let snoozeTimeout = null;
let idleMode = false;

function openTab(tabId, button) {
  document.querySelectorAll(".tab-page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  button.classList.add("active");
}

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

  const timer = document.getElementById("stretchTimer");
  const message = document.getElementById("stretchMessage");
  const stopBtn = document.getElementById("stopStretchBtn");

  timer.innerText = formatTime(stretchSeconds);
  message.innerHTML = "Stretch session started.<br>Keep going!";

  stopBtn.disabled = false;
  stopBtn.classList.remove("inactive-stop");
  stopBtn.classList.add("active-stop");

  stretchInterval = setInterval(() => {
    stretchSeconds--;
    timer.innerText = formatTime(stretchSeconds);

    if (stretchSeconds <= 0) {
      clearInterval(stretchInterval);
    
      message.innerHTML =
        "✅ Stretching Complete!<br>Great job taking a break.";
    
      timer.innerText = "DONE";
    
      stopBtn.disabled = true;
      stopBtn.classList.remove("active-stop");
      stopBtn.classList.add("inactive-stop");
    
      const startBtn = document.getElementById("startStretchBtn");
    
      if (startBtn) {
        startBtn.innerText = "Reset Timer";
        startBtn.onclick = resetStretchTimer;
      }
    }
  }, 1000);
}

function resetStretchTimer() {
  stretchSeconds = 180;

  document.getElementById("stretchTimer").innerText = "03:00";

  document.getElementById("stretchMessage").innerHTML =
    "You've been standing for 2h 15m.<br>Let's stretch those legs!";

  const startBtn = document.getElementById("startStretchBtn");

  if (startBtn) {
    startBtn.innerText = "Start 3-Min Stretch";
    startBtn.onclick = startStretchTimer;
  }
}

function stopStretchTimer() {
  clearInterval(stretchInterval);
  stretchSeconds = 180;

  document.getElementById("stretchTimer").innerText = "03:00";
  document.getElementById("stretchMessage").innerHTML =
    "Stretch stopped.<br>You can restart anytime.";

  const stopBtn = document.getElementById("stopStretchBtn");
  stopBtn.disabled = true;
  stopBtn.classList.remove("active-stop");
  stopBtn.classList.add("inactive-stop");
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

  clearTimeout(snoozeTimeout);
  clearInterval(stretchInterval);

  if (idleMode) {
    document.getElementById("stretchMessage").innerHTML =
      "Idle Mode is on.<br>Reminders are paused.";
  } else {
    document.getElementById("stretchMessage").innerHTML =
      "Idle Mode is off.<br>Stretch reminders are active.";
  }
}

function toggleConnection() {
  connected = !connected;

  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");

  if (!dot || !text) return;

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

  const standingTime = document.getElementById("standingTime");
  const goalPercent = document.getElementById("goalPercent");
  const bar = document.querySelector(".bar i");

  if (standingTime) standingTime.innerText = `${hours}h ${mins}m`;
  if (goalPercent) goalPercent.innerText = `${percent}%`;
  if (bar) bar.style.width = `${percent}%`;
}

function showAlerts() {
  alert("2 Alerts\n\n• Standing too long\n• High heel pressure detected");
}

function updateComfortValue() {
  const slider = document.getElementById("comfortSlider");
  const value = document.getElementById("comfortValue");

  if (!slider || !value) return;

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

const historyData = {
  daily: [
    { label: "Monday", time: "3h 40m", warning: false },
    { label: "Tuesday", time: "5h 10m", warning: true },
    { label: "Wednesday", time: "4h 25m", warning: false },
    { label: "Thursday", time: "6h 15m", warning: true },
    { label: "Friday", time: "7h 00m", warning: true }
  ],
  weekly: [
    { label: "Week 1", time: "24h 20m", warning: false },
    { label: "Week 2", time: "28h 45m", warning: true },
    { label: "Week 3", time: "25h 30m", warning: false }
  ],
  monthly: [
    { label: "January", time: "104h 10m", warning: false },
    { label: "February", time: "118h 35m", warning: true },
    { label: "March", time: "96h 50m", warning: false }
  ]
};

  function showHistory(type, button) {
    const list = document.getElementById("historyList");
    const chart = document.getElementById("historyChart");
  
    document.querySelectorAll(".history-btn").forEach(btn => {
      btn.classList.remove("active-history");
    });
  
    button.classList.add("active-history");
  
    list.innerHTML = "";
    chart.innerHTML = "";
  
    historyData[type].forEach(item => {
      const hours = parseFloat(item.time);
  
      const bar = document.createElement("div");
      bar.className = "history-bar-row";
  
      bar.innerHTML = `
        <span>${item.label}</span>
        <div class="history-bar-bg">
          <div 
            class="history-bar-fill ${item.warning ? "warning-bar" : "normal-bar"}"
            style="width: ${Math.min(hours * 13, 100)}%">
          </div>
        </div>
        <small>${item.time}</small>
      `;
  
      chart.appendChild(bar);
  
      const row = document.createElement("div");
      row.className = "list-card history-item";
  
      row.innerHTML = `
        <b>${item.label} ${item.warning ? "⚠️" : ""}</b>
        <strong>${item.time}</strong>
        <small>${item.warning ? "High standing duration detected" : "Normal standing pattern"}</small>
      `;
  
      if (item.warning) {
        row.onclick = () => {
          alert(
            `${item.label} Warning\n\n` +
            `Standing time: ${item.time}\n` +
            "You may need more posture changes or stretch breaks."
          );
        };
      }
  
      list.appendChild(row);
    });
  }

  button.classList.add("active-history");

  list.innerHTML = "";

  historyData[type].forEach(item => {
    const row = document.createElement("div");
    row.className = "list-card history-item";

    row.innerHTML = `
      <b>${item.label} ${item.warning ? "⚠️" : ""}</b>
      <strong>${item.time}</strong>
      <small>${item.warning ? "High standing duration detected" : "Normal standing pattern"}</small>
    `;

    if (item.warning) {
      row.onclick = () => {
        alert(
          `${item.label} Warning\n\n` +
          `Standing time: ${item.time}\n` +
          "You may need more posture changes or stretch breaks."
        );
      };
    }

    list.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dailyButton = document.querySelector(".history-btn");
  if (dailyButton) {
    showHistory("daily", dailyButton);
  }
});
