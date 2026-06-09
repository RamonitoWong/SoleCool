let connected = true;
let standingMinutes = 272;
let stretchSeconds = 180;
let stretchInterval = null;
let snoozeTimeout = null;
let idleMode = false;
let currentHistoryType = "daily";

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
  const startBtn = document.getElementById("startStretchBtn");

  timer.innerText = formatTime(stretchSeconds);
  message.innerHTML = "Stretch session started.<br>Keep going!";

  if (startBtn) {
    startBtn.disabled = true;
    startBtn.style.opacity = "0.6";
  }

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

      if (startBtn) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.innerText = "Reset Timer";
        startBtn.onclick = resetStretchTimer;
      }
    }
  }, 1000);
}

function resetStretchTimer() {
  clearInterval(stretchInterval);
  stretchSeconds = 180;

  document.getElementById("stretchTimer").innerText = "03:00";

  document.getElementById("stretchMessage").innerHTML =
    "You've been standing for 2h 15m.<br>Let's stretch those legs!";

  const startBtn = document.getElementById("startStretchBtn");
  const stopBtn = document.getElementById("stopStretchBtn");

  if (startBtn) {
    startBtn.innerText = "Start 3-Min Stretch";
    startBtn.onclick = startStretchTimer;
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
  }

  if (stopBtn) {
    stopBtn.disabled = true;
    stopBtn.classList.remove("active-stop");
    stopBtn.classList.add("inactive-stop");
  }
}

function stopStretchTimer() {
  clearInterval(stretchInterval);
  stretchSeconds = 180;

  document.getElementById("stretchTimer").innerText = "03:00";
  document.getElementById("stretchMessage").innerHTML =
    "Stretch stopped.<br>You can restart anytime.";

  const stopBtn = document.getElementById("stopStretchBtn");
  const startBtn = document.getElementById("startStretchBtn");

  if (stopBtn) {
    stopBtn.disabled = true;
    stopBtn.classList.remove("active-stop");
    stopBtn.classList.add("inactive-stop");
  }

  if (startBtn) {
    startBtn.innerText = "Start 3-Min Stretch";
    startBtn.onclick = startStretchTimer;
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
  }
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
    resetStretchTimer();
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

const historyRanges = {
  daily: [
    "24 May 2026 - 30 May 2026",
    "31 May 2026 - 6 June 2026",
    "1 June 2026 - 7 June 2026"
  ],
  weekly: [
    "24 May 2026 - 30 May 2026",
    "31 May 2026 - 6 June 2026",
    "7 June 2026 - 13 June 2026"
  ],
  monthly: [
    "May 2026",
    "June 2026",
    "July 2026"
  ]
};

const historyData = {
  daily: {
    "24 May 2026 - 30 May 2026": [
      { label: "Sun", time: "2h 10m", warning: false },
      { label: "Mon", time: "3h 20m", warning: false },
      { label: "Tue", time: "4h 40m", warning: false },
      { label: "Wed", time: "5h 20m", warning: true },
      { label: "Thu", time: "4h 10m", warning: false },
      { label: "Fri", time: "6h 30m", warning: true },
      { label: "Sat", time: "2h 45m", warning: false }
    ],
    "31 May 2026 - 6 June 2026": [
      { label: "Sun", time: "3h 00m", warning: false },
      { label: "Mon", time: "4h 05m", warning: false },
      { label: "Tue", time: "5h 45m", warning: true },
      { label: "Wed", time: "4h 30m", warning: false },
      { label: "Thu", time: "6h 00m", warning: true },
      { label: "Fri", time: "5h 20m", warning: true },
      { label: "Sat", time: "2h 05m", warning: false }
    ],
    "1 June 2026 - 7 June 2026": [
      { label: "Mon", time: "3h 40m", warning: false },
      { label: "Tue", time: "5h 10m", warning: true },
      { label: "Wed", time: "4h 25m", warning: false },
      { label: "Thu", time: "6h 15m", warning: true },
      { label: "Fri", time: "7h 00m", warning: true },
      { label: "Sat", time: "2h 35m", warning: false },
      { label: "Sun", time: "4h 12m", warning: false }
    ]
  },
  weekly: {
    "24 May 2026 - 30 May 2026": [
      { label: "Week", time: "29h 05m", warning: true }
    ],
    "31 May 2026 - 6 June 2026": [
      { label: "Week", time: "30h 45m", warning: true }
    ],
    "7 June 2026 - 13 June 2026": [
      { label: "Week", time: "24h 55m", warning: false }
    ]
  },
  monthly: {
    "May 2026": [
      { label: "May", time: "86h 20m", warning: false }
    ],
    "June 2026": [
      { label: "Jun", time: "118h 35m", warning: true }
    ],
    "July 2026": [
      { label: "Jul", time: "96h 50m", warning: false }
    ]
  }
};


function getHours(timeString) {
  const hoursMatch = timeString.match(/(\d+)h/);
  const minsMatch = timeString.match(/(\d+)m/);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const mins = minsMatch ? Number(minsMatch[1]) : 0;

  return hours + mins / 60;
}

function updateHistoryDropdown(type) {
  const select = document.getElementById("historyDateSelect");

  if (!select) return;

  select.innerHTML = "";

  historyRanges[type].forEach(range => {
    const option = document.createElement("option");
    option.value = range;
    option.textContent = range;
    select.appendChild(option);
  });
}

function updateHistoryRange() {
  const activeButton = document.querySelector(".active-history");

  if (activeButton) {
    showHistory(currentHistoryType, activeButton);
  }
}

function showHistory(type, button, keepSelection = false) {
  currentHistoryType = type;

  const chart = document.getElementById("historyChart");
  const select = document.getElementById("historyDateSelect");
  const rangeLabel = document.getElementById("selectedHistoryRange");

  if (!chart || !button || !select) return;

  document.querySelectorAll(".history-btn").forEach(btn => {
    btn.classList.remove("active-history");
  });

  button.classList.add("active-history");

  if (!keepSelection) {
    updateHistoryDropdown(type);
  }

  const selectedRange = select.value;

  if (rangeLabel) {
    rangeLabel.innerText = `Viewing: ${selectedRange}`;
  }

  chart.innerHTML = "";

  const selectedData = historyData[type][selectedRange];

  selectedData.forEach(item => {

    const hours = getHours(item.time);

    let maxHours = 8;

    if (type === "weekly") maxHours = 35;
    if (type === "monthly") maxHours = 130;

    const height = Math.min((hours / maxHours) * 100, 100);

    const bar = document.createElement("div");
    bar.className = "vertical-bar-item";

    bar.innerHTML = `
      <div class="bar-value">${item.time}</div>
      <div class="vertical-bar-bg">
        <div
          class="vertical-bar-fill ${item.warning ? "warning-bar" : "normal-bar"}"
          style="height:${height}%">
        </div>
      </div>
      <small>${item.label}</small>
    `;

    chart.appendChild(bar);
  });

  updateHistorySummary(type, selectedRange);
}

function updateHistorySummary(type, selectedRange) {

  const todayStandingTime =
    document.getElementById("todayStandingTime");

  const todayDateLabel =
    document.getElementById("todayDateLabel");

  const weekStandingTime =
    document.getElementById("weekStandingTime");

  const weekDateLabel =
    document.getElementById("weekDateLabel");

  if (todayStandingTime)
    todayStandingTime.innerText = "4h 12m";

  if (todayDateLabel)
    todayDateLabel.innerText =
      "Standing duration • 7 June 2026";

  if (type === "daily") {
    weekStandingTime.innerText = "33h 17m";
    weekDateLabel.innerText = selectedRange;
  }

  if (type === "weekly") {
    weekStandingTime.innerText =
      historyData.weekly[selectedRange][0].time;

    weekDateLabel.innerText = selectedRange;
  }

  if (type === "monthly") {
    weekStandingTime.innerText =
      historyData.monthly[selectedRange][0].time;

    weekDateLabel.innerText = selectedRange;
  }
}

function updateHistoryRange() {
  const activeButton =
    document.querySelector(".active-history");

  if (activeButton) {
    showHistory(
      currentHistoryType,
      activeButton,
      true
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {

  updateHistoryDropdown("daily");

  const dailyButton =
    document.querySelector(".history-btn");

  if (dailyButton) {
    showHistory("daily", dailyButton);
  }
});
let footbeds = {
  left: true,
  right: true
};

function toggleFootbed(side) {
  footbeds[side] = !footbeds[side];

  const dot = document.getElementById(`${side}FootDot`);
  const status = document.getElementById(`${side}FootStatus`);
  const button = document.getElementById(`${side}FootBtn`);

  if (footbeds[side]) {
    dot.style.background = "#20c45a";
    status.innerText =
      side === "left"
        ? "Battery 92% • Connected"
        : "Battery 90% • Connected";
    button.innerText = "Disconnect";
  } else {
    dot.style.background = "#ff3b30";
    status.innerText = "Disconnected";
    button.innerText = "Connect";
  }
}

let therapySeconds = 600;
let therapyInterval = null;
let therapyRunning = false;

function openTherapyPage() {
  document.getElementById("devicesMain").style.display = "none";
  document.getElementById("therapyPage").style.display = "block";
}

function closeTherapyPage() {
  stopTherapyTimer();
  document.getElementById("therapyPage").style.display = "none";
  document.getElementById("devicesMain").style.display = "block";
}

function setTherapyDuration() {
  if (therapyRunning) return;

  therapySeconds = Number(document.getElementById("therapyDuration").value);
  document.getElementById("therapyTimer").innerText = formatTime(therapySeconds);
}

function toggleTherapyTimer() {
  const btn = document.getElementById("therapyStartPauseBtn");

  if (therapyRunning) {
    clearInterval(therapyInterval);
    therapyRunning = false;
    btn.innerText = "Start";
    return;
  }

  therapyRunning = true;
  btn.innerText = "Pause";

  therapyInterval = setInterval(() => {
    therapySeconds--;
    document.getElementById("therapyTimer").innerText = formatTime(therapySeconds);

    if (therapySeconds <= 0) {
      clearInterval(therapyInterval);
      therapyRunning = false;
      document.getElementById("therapyTimer").innerText = "DONE";
      btn.innerText = "Start";
    }
  }, 1000);
}

function stopTherapyTimer() {
  clearInterval(therapyInterval);
  therapyRunning = false;

  const sessionSeconds = Number(document.getElementById("comfortSession").value);
  therapySeconds = sessionSeconds;

  document.getElementById("therapyTimer").innerText = formatTime(therapySeconds);
  document.getElementById("therapyStartPauseBtn").innerText = "Start";
}

function resetTherapyTimer() {
  clearInterval(therapyInterval);
  therapySeconds = 600;

  document.getElementById("therapyTimer").innerText = "10:00";

  const stopBtn = document.getElementById("stopTherapyBtn");
  stopBtn.disabled = true;
  stopBtn.classList.add("inactive-stop");
}
function secondsToMinutesText(seconds) {
  return `${Math.round(seconds / 60)} min`;
}

function updateTherapySettings() {
  const sessionSelect = document.getElementById("comfortSession");
  const restSelect = document.getElementById("comfortRest");

  if (!sessionSelect || !restSelect) return;

  const sessionSeconds = Number(sessionSelect.value);
  const restSeconds = Number(restSelect.value);

  const therapySessionLabel = document.getElementById("therapySessionLabel");
  const therapyRestLabel = document.getElementById("therapyRestLabel");
  const therapyIntensityLabel = document.getElementById("therapyIntensityLabel");

  if (therapySessionLabel) {
    therapySessionLabel.innerText = secondsToMinutesText(sessionSeconds);
  }

  if (therapyRestLabel) {
    therapyRestLabel.innerText = secondsToMinutesText(restSeconds);
  }

  if (therapyIntensityLabel) {
    therapyIntensityLabel.innerText =
      document.getElementById("comfortValue").innerText;
  }

  if (!therapyRunning) {
    therapySeconds = sessionSeconds;
    document.getElementById("therapyTimer").innerText = formatTime(therapySeconds);
  }
}

function openTherapyPage() {
  const comfortToggle = document.getElementById("comfortToggle");

  if (comfortToggle && !comfortToggle.checked) {
    alert("Comfort Mode is turned off.");
    return;
  }

  updateTherapySettings();

  document.getElementById("devicesMain").style.display = "none";
  document.getElementById("therapyPage").style.display = "block";
}
