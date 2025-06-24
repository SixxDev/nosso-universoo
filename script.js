const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const mouse = { x: null, y: null };
const particleCount = 8000;
const particles = [];

const scaleBase = window.innerWidth <= 600 ? 9.5 : 15;

let pulse = 1;

const colors = ['#ff4d4d', '#ff9999', '#ff1a75', '#ff6666'];

// Estrelas fixas
const stars = [];
for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5,
    alpha: Math.random() * 0.5 + 0.5,
    delta: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
  });
}

// Partículas do coração
for (let i = 0; i < particleCount; i++) {
  const t = Math.random() * Math.PI * 2;
  const k = Math.sqrt(Math.random());
  const r = 16 * Math.pow(Math.sin(t), 3) * k;
  const x = width / 2 + r * scaleBase;
  const y =
    height / 2 -
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)) *
      scaleBase *
      k;

  particles.push({
    x: x + (Math.random() - 0.8) * 10,
    y: y + (Math.random() - 0.8) * 10,
    baseX: x,
    baseY: y,
    size: 1.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  });
}

// Estrelas cadentes suaves
const shootingStars = [];

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * width,
    y: Math.random() * height / 2,
    vx: Math.random() * 4 + 4,
    vy: Math.random() * 2 + 2,
    alpha: 0,
    fadeIn: true,
    maxAlpha: Math.random() * 0.7 + 0.3,
  });
}

setInterval(() => {
  if (Math.random() < 0.7) {
    createShootingStar();
  }
}, 1200);

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];

    if (s.fadeIn && s.alpha < s.maxAlpha) {
      s.alpha += 0.02;
    } else {
      s.fadeIn = false;
      s.alpha -= 0.003;
    }

    const xEnd = s.x - s.vx * 15;
    const yEnd = s.y - s.vy * 15;

    const grad = ctx.createLinearGradient(s.x, s.y, xEnd, yEnd);
    grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
    grad.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    s.x += s.vx;
    s.y += s.vy;

    if (s.alpha <= 0 || s.x > width || s.y > height) {
      shootingStars.splice(i, 1);
    }
  }
}

// Suporte a mouse e toque
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

window.addEventListener("touchstart", (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

// Animação principal
function animate() {
  pulse = 1 + 0.02 * Math.sin(Date.now() / 200);
  ctx.clearRect(0, 0, width, height);

  // Fundo
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  // Estrelas fixas
  for (let s of stars) {
    s.alpha += s.delta;
    if (s.alpha <= 0.3 || s.alpha >= 1) s.delta *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }

  // Estrelas cadentes
  drawShootingStars();

  // Partículas do coração
  for (let p of particles) {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      const angle = Math.atan2(dy, dx);
      const force = (100 - dist) / 10;
      p.x -= Math.cos(angle) * force;
      p.y -= Math.sin(angle) * force;
    } else {
      p.x += (p.baseX - p.x) * 0.05;
      p.y += (p.baseY - p.y) * 0.05;
    }

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  requestAnimationFrame(animate);
}

animate();

// Redimensionamento da tela
window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});
