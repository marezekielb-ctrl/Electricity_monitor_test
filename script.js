let port;
let reader;
let buffer = "";
let log = [];

async function connect() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });

  const decoder = new TextDecoderStream();
  port.readable.pipeTo(decoder.writable);
  reader = decoder.readable.getReader();

  readLoop();
}

async function readLoop() {
  while (true) {
    const result = await reader.read();
    if (result.done) break;

    buffer += result.value;
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (let i = 0; i < lines.length; i++) {
      try {
        const d = JSON.parse(lines[i]);

        document.getElementById("i1").textContent = d.i1;
        document.getElementById("p1").textContent = d.p1;
        document.getElementById("e1").textContent = d.e1;
        document.getElementById("c1").textContent = d.c1;

        document.getElementById("i2").textContent = d.i2;
        document.getElementById("p2").textContent = d.p2;
        document.getElementById("e2").textContent = d.e2;
        document.getElementById("c2").textContent = d.c2;

        log.push({
          time: new Date().toLocaleTimeString(),
          i1: d.i1,
          p1: d.p1,
          e1: d.e1,
          c1: d.c1,
          i2: d.i2,
          p2: d.p2,
          e2: d.e2,
          c2: d.c2
        });
      } catch (e) {}
    }
  }
}

function download() {
  let csv = "Time,I1,P1,E1,C1,I2,P2,E2,C2\n";

  for (let i = 0; i < log.length; i++) {
    csv +=
      log[i].time + "," +
      log[i].i1 + "," +
      log[i].p1 + "," +
      log[i].e1 + "," +
      log[i].c1 + "," +
      log[i].i2 + "," +
      log[i].p2 + "," +
      log[i].e2 + "," +
      log[i].c2 + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "energy_log.csv";
  a.click();

  URL.revokeObjectURL(url);
}
