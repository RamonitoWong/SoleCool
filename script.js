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

let currentMonth = "June 2026";
let currentWeekIndex = 0;

const monthWeeks = {
  "May 2026": [
    {
      range: "24 May 2026 - 30 May 2026",
      data: [
        { label: "Sun", time: "2h 10m", warning: false },
        { label: "Mon", time: "3h 20m", warning: false },
        { label: "Tue", time: "4h 40m", warning: false },
        { label: "Wed", time: "5h 20m", warning: true },
        { label: "Thu", time: "4h 10m", warning: false },
        { label: "Fri", time: "6h 30m", warning: true },
        { label: "Sat", time: "2h 45m", warning: false }
      ]
    }
  ],

  "June 2026": [
    {
      range: "1 June 2026 - 7 June 2026",
      data: [
        { label: "Mon", time: "3h 40m", warning: false },
        { label: "Tue", time: "5h 10m", warning: true },
        { label: "Wed", time: "4h 25m", warning: false },
        { label: "Thu", time: "6h 15m", warning: true },
        { label: "Fri", time: "7h 00m", warning: true },
        { label: "Sat", time: "2h 35m", warning: false },
        { label: "Sun", time: "4h 32m", warning: false }
      ]
    },
    {
      range: "8 June 2026 - 14 June 2026",
      data: [
        { label: "Mon", time: "4h 00m", warning: false },
        { label: "Tue", time: "4h 45m", warning: false },
        { label: "Wed", time: "6h 10m", warning: true },
        { label: "Thu", time: "5h 30m", warning: true },
        { label: "Fri", time: "3h 55m", warning: false },
        { label: "Sat", time: "2h 20m", warning: false },
        { label: "Sun", time: "3h 10m", warning: false }
      ]
    },
    {
      range: "15 June 2026 - 21 June 2026",
      data: [
        { label: "Mon", time: "3h 30m", warning: false },
        { label: "Tue", time: "4h 20m", warning: false },
        { label: "Wed", time: "5h 40m", warning: true },
        { label: "Thu", time: "4h 50m", warning: false },
        { label: "Fri", time: "6h 20m", warning: true },
        { label: "Sat", time: "3h 00m", warning: false },
        { label: "Sun", time: "2h 45m", warning: false }
      ]
    }
  ],

  "July 2026": [
    {
      range: "1 July 2026 - 7 July 2026",
      data: [
        { label: "Wed", time: "3h 20m", warning: false },
        { label: "Thu", time: "4h 10m", warning: false },
        { label: "Fri", time: "5h 50m", warning: true },
        { label: "Sat", time: "2h 30m", warning: false },
        { label: "Sun", time: "3h 15m", warning: false },
        { label: "Mon", time: "4h 40m", warning: false },
        { label: "Tue", time: "6h 05m", warning: true }
      ]
    }
  ]
};

function getHours(timeString) {
  const hoursMatch = timeString.match(/(\d+)h/);
  const minsMatch = timeString.match(/(\d+)m/);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const mins = minsMatch ? Number(minsMatch[1]) : 0;

  return hours + mins / 60;
}

function getHistoryMonthSelect() {
  return (
    document.getElementById("historyMonthSelect") ||
    document.getElementById("historyDateSelect")
  );
}

function setupHistoryMonthDropdown() {
  const select = getHistoryMonthSelect();

  if (!select) return;

  select.innerHTML = "";

  Object.keys(monthWeeks).forEach(month => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;

    if (month === currentMonth) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

function renderHistoryChart() {
  const chart = document.getElementById("historyChart");
  const rangeLabel = document.getElementById("selectedHistoryRange");
  const weekStandingTime = document.getElementById("weekStandingTime");
  const weekDateLabel = document.getElementById("weekDateLabel");
  const todayStandingTime = document.getElementById("todayStandingTime");
  const todayDateLabel = document.getElementById("todayDateLabel");

  if (!chart) return;

  const weeks = monthWeeks[currentMonth];

  if (!weeks || weeks.length === 0) return;

  if (currentWeekIndex < 0) currentWeekIndex = 0;
  if (currentWeekIndex > weeks.length - 1) currentWeekIndex = weeks.length - 1;

  const week = weeks[currentWeekIndex];

  chart.innerHTML = "";

  if (rangeLabel) {
    rangeLabel.innerText = `Viewing: ${week.range}`;
  }

  let totalMinutes = 0;

  week.data.forEach(item => {
    const hours = getHours(item.time);
    totalMinutes += Math.round(hours * 60);

    const height = Math.min((hours / 8) * 100, 100);

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

   if (item.warning) {
  bar.onclick = () => {
    showWarningModal(
      item.label,
      item.time
    );
  };
}

    chart.appendChild(bar);
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (weekStandingTime) {
    weekStandingTime.innerText = `${totalHours}h ${mins}m`;
  }

  if (weekDateLabel) {
    weekDateLabel.innerText = week.range;
  }

  if (todayStandingTime) {
    todayStandingTime.innerText = "4h 32m";
  }

  if (todayDateLabel) {
    todayDateLabel.innerText = "Standing duration • 7 June 2026";
  }
}

function changeHistoryMonth() {
  const select = getHistoryMonthSelect();

  if (!select) return;

  currentMonth = select.value;
  currentWeekIndex = 0;
  renderHistoryChart();
}

function previousHistoryWeek() {
  if (currentWeekIndex > 0) {
    currentWeekIndex--;
    renderHistoryChart();
  }
}

function nextHistoryWeek() {
  const weeks = monthWeeks[currentMonth];

  if (weeks && currentWeekIndex < weeks.length - 1) {
    currentWeekIndex++;
    renderHistoryChart();
  }
}

/* Keeps old button-based code from breaking if old HTML is still present */
function updateHistoryRange() {
  changeHistoryMonth();
}

function showHistory() {
  renderHistoryChart();
}

document.addEventListener("DOMContentLoaded", () => {
  setupHistoryMonthDropdown();
  renderHistoryChart();

  if (typeof updateTherapySettings === "function") {
    updateTherapySettings();
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
  }
}

function enableTherapy() {
  const enableBtn = document.getElementById("enableTherapyBtn");
  const stopBtn = document.getElementById("stopTherapyBtn");

  enableBtn.classList.remove("therapy-btn-active");
  enableBtn.classList.add("therapy-btn-hollow");

  stopBtn.classList.remove("therapy-btn-hollow");
  stopBtn.classList.add("therapy-btn-active");
}

function stopTherapyMode() {
  const enableBtn = document.getElementById("enableTherapyBtn");
  const stopBtn = document.getElementById("stopTherapyBtn");

  stopBtn.classList.remove("therapy-btn-active");
  stopBtn.classList.add("therapy-btn-hollow");

  enableBtn.classList.remove("therapy-btn-hollow");
  enableBtn.classList.add("therapy-btn-active");
}
function showWarningModal(day, standingTime) {

  document.getElementById("warningText").innerHTML =
    `<b>${day}</b><br><br>
     Standing Time: ${standingTime}<br><br>
     You may need more posture changes or stretch breaks.`;

  document.getElementById("warningModal").style.display = "flex";
}

function closeWarningModal() {
  document.getElementById("warningModal").style.display = "none";
}
function openMorePage(pageId) {
  document.getElementById("moreMain").style.display = "none";

  document.querySelectorAll(".more-subpage").forEach(page => {
    page.style.display = "none";
  });

  document.getElementById(pageId).style.display = "block";
}

function backToMore() {
  document.querySelectorAll(".more-subpage").forEach(page => {
    page.style.display = "none";
  });

  document.getElementById("moreMain").style.display = "block";
}
