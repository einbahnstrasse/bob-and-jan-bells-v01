// --- gyro-graph.js ---
// Plots and normalizes gyro data

let canvasAlpha, ctxAlpha, canvasBeta, ctxBeta, canvasGamma, ctxGamma;
let alphaBuffer = [], betaBuffer = [], gammaBuffer = [], maxLen = 100;

function setupGraphs() {
  canvasAlpha = document.getElementById("alphaChart");
  ctxAlpha = canvasAlpha.getContext("2d");
  canvasBeta = document.getElementById("betaChart");
  ctxBeta = canvasBeta.getContext("2d");
  canvasGamma = document.getElementById("gammaChart");
  ctxGamma = canvasGamma.getContext("2d");
  drawLoop();
}

function drawLoop() {
  drawGraph(ctxAlpha, alphaBuffer, "Alpha (Z)", document.getElementById("alphaLabel"));
  drawGraph(ctxBeta, betaBuffer, "Beta (X)", document.getElementById("betaLabel"));
  drawGraph(ctxGamma, gammaBuffer, "Gamma (Y)", document.getElementById("gammaLabel"));
  requestAnimationFrame(drawLoop);
}

function drawGraph(ctx, data, label, labelElem) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#33aaff";
  const maxAbs = Math.max(1, ...data.map(Math.abs));
  data.forEach((val, i) => {
    const x = (i / maxLen) * ctx.canvas.width;
    const y = ctx.canvas.height / 2 - (val / maxAbs) * ctx.canvas.height / 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  const latest = data[data.length - 1] || 0;
  labelElem.textContent = `${label}: ${latest.toFixed(2)}`;
}

function feedGyro({ alpha, beta, gamma }) {
  alphaBuffer.push(alpha); if (alphaBuffer.length > maxLen) alphaBuffer.shift();
  betaBuffer.push(beta); if (betaBuffer.length > maxLen) betaBuffer.shift();
  gammaBuffer.push(gamma); if (gammaBuffer.length > maxLen) gammaBuffer.shift();
}

