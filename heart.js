const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scale = 20;
const baseCenterX = canvas.width / 2;
const baseCenterY = canvas.height / 2;

const lineCount = 300; // çizgi sayısı
const speed = 0.006;   // hız

const lines = [];

for (let i = 0; i < lineCount; i++) {
  lines.push({
    t: (Math.PI * 2 / lineCount) * i,
    prevPos: null,
    phaseX: Math.random() * Math.PI * 2, // dalgalanma fazları
    phaseY: Math.random() * Math.PI * 2,
  });
}

function heartFunction(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x, y };
}

let time = 0;

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Kalbin hafif sarsılması için offset hesapla
  const shakeX = Math.sin(time * 3) * 0; // genlik 5 px, frekans 3 rad/frame
  const shakeY = Math.cos(time * 3) * 0;

  const centerX = baseCenterX + shakeX;
  const centerY = baseCenterY + shakeY;

  ctx.strokeStyle = 'rgba(255, 20, 137, 0.8)';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(255, 20, 20, 0.7)';
  ctx.shadowBlur = 15;

  for (let line of lines) {
    // Kalp üzerindeki temel nokta
    const pos = heartFunction(line.t);

    // Kalbin etrafında rastgele dolanma için dalgalı offsetler
    const offsetX = Math.sin(time * 5 + line.phaseX) * 8; // 8 px genlik
    const offsetY = Math.cos(time * 5 + line.phaseY) * 8;

    // Final pozisyon
    const x = centerX + pos.x * scale + offsetX;
    const y = centerY + pos.y * scale + offsetY;

    if (line.prevPos) {
      ctx.beginPath();
      ctx.moveTo(line.prevPos.x, line.prevPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    line.prevPos = { x, y };

    line.t += speed;
    if (line.t > Math.PI * 2) line.t -= Math.PI * 2;
  }

  ctx.shadowBlur = 0;

  time += 0.02;

  requestAnimationFrame(draw);
}

draw();
