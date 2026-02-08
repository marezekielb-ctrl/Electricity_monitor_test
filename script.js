let voltage = 0;
let current = 0;
let power = 0;
let energy = 0;
let cost = 0;

function updateDisplay() {
  document.getElementById("voltage").innerText = voltage + " V";
  document.getElementById("current").innerText = current.toFixed(2) + " A";
  document.getElementById("power").innerText = power.toFixed(1) + " W";
  document.getElementById("energy").innerText = energy.toFixed(4) + " kWh";
  document.getElementById("cost").innerText = "₱" + cost.toFixed(2);
}

function simulateData() {
  voltage = 230;
  current = Math.random() * 0.2;
  power = voltage * current;
  energy = energy + power / 3600000;
  cost = energy * 10;
}

setInterval(() => {
  simulateData();
  updateDisplay();
}, 2000);

