let port
let reader
let buffer = ""
let log = []

async function connect() {
  port = await navigator.serial.requestPort()
  await port.open({ baudRate: 115200 })

  const decoder = new TextDecoderStream()
  port.readable.pipeTo(decoder.writable)
  reader = decoder.readable.getReader()

  readLoop()
}

async function readLoop() {
  while (true) {
    const result = await reader.read()
    if (result.done) break

    buffer += result.value
    let lines = buffer.split("\n")
    buffer = lines.pop()

    for (let line of lines) {
      try {
        const d = JSON.parse(line)

        document.getElementById("i1").textContent = d.i1
        document.getElementById("p1").textContent = d.p1
        document.getElementById("e1").textContent = d.e1
        document.getElementById("c1").textContent = d.c1

        document.getElementById("i2").textContent = d.i2
        document.getElementById("p2").textContent = d.p2
        document.getElementById("e2").textContent = d.e2
        document.getElementById("c2").textContent = d.c2

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
        })
      } catch {}
    }
  }
}

function download() {
  let csv = "Time,I1,P1,E1,C1,I2,P2,E2,C2\n"

  log.forEach(r => {
    csv += ${r.time},${r.i1},${r.p1},${r.e1},${r.c1},${r.i2},${r.p2},${r.e2},${r.c2}\n
  })

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "energy_log.csv"
  a.click()

  URL.revokeObjectURL(url)
}
