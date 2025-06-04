// GyroGraph.js
console.log('[GyroGraph] Loaded');

const maxPoints = 100;
const alphaData = [], betaData = [], gammaData = [];

function updateGraph(ctx, dataArray, newVal) {
  if (dataArray.length >= maxPoints) dataArray.shift();
  dataArray.push(newVal);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  dataArray.forEach((val, i) => {
    const x = (i / maxPoints) * ctx.canvas.width;
    const y = ctx.canvas.height * (1 - (val + 180) / 360);
    ctx.lineTo(x, y);
  });
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent');
  ctx.stroke();
}

export function startGyroTracking() {
  const alphaCtx = document.getElementById('alphaChart').getContext('2d');
  const betaCtx = document.getElementById('betaChart').getContext('2d');
  const gammaCtx = document.getElementById('gammaChart').getContext('2d');

  window.addEventListener('deviceorientation', (e) => {
    const alpha = e.alpha || 0;
    const beta = e.beta || 0;
    const gamma = e.gamma || 0;

    document.getElementById('alphaLabel').textContent = `Alpha (Z): ${alpha.toFixed(2)}`;
    document.getElementById('betaLabel').textContent = `Beta (X): ${beta.toFixed(2)}`;
    document.getElementById('gammaLabel').textContent = `Gamma (Y): ${gamma.toFixed(2)}`;

    updateGraph(alphaCtx, alphaData, alpha);
    updateGraph(betaCtx, betaData, beta);
    updateGraph(gammaCtx, gammaData, gamma);
  });

  console.log('[GyroGraph] Gyroscope tracking started');
}