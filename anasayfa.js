// Başlangıç tarihi (birlikte olmaya başladığınız tarih)
// Örnek: 15 Mayıs 2020, 14:30:00
const baslangicTarihi = new Date(2022, 5, 20, 0, 0, 0);

// Sayaç için DOM elementi oluşturduk (galeriden önce ekleniyor)
const sayaçContainer = document.createElement('section');
sayaçContainer.id = 'together-duration';
sayaçContainer.style.textAlign = 'center';
sayaçContainer.style.margin = '40px 0';
sayaçContainer.style.color = '#330029';
sayaçContainer.style.fontWeight = '700';

sayaçContainer.innerHTML = `
  <h2>Beraberliğimizin Süresi</h2>
  <div id="duration" style="font-size: 2rem; margin-top: 10px; letter-spacing: 1.5px;">
    -- yıl -- ay -- gün -- saat -- dakika -- saniye
  </div>
`;

const gallerySection = document.getElementById('gallery');
gallerySection.parentNode.insertBefore(sayaçContainer, gallerySection);

// Tarihler arası farkı detaylı hesaplama fonksiyonu
function farkHesapla(baslangic, simdi) {
  let yil = simdi.getFullYear() - baslangic.getFullYear();
  let ay = simdi.getMonth() - baslangic.getMonth();
  let gun = simdi.getDate() - baslangic.getDate();
  let saat = simdi.getHours() - baslangic.getHours();
  let dakika = simdi.getMinutes() - baslangic.getMinutes();
  let saniye = simdi.getSeconds() - baslangic.getSeconds();

  if (saniye < 0) {
    saniye += 60;
    dakika--;
  }
  if (dakika < 0) {
    dakika += 60;
    saat--;
  }
  if (saat < 0) {
    saat += 24;
    gun--;
  }
  if (gun < 0) {
    // Bir önceki ayın kaç gün olduğunu bul
    const oncekiAy = new Date(simdi.getFullYear(), simdi.getMonth(), 0);
    gun += oncekiAy.getDate();
    ay--;
  }
  if (ay < 0) {
    ay += 12;
    yil--;
  }

  return { yil, ay, gun, saat, dakika, saniye };
}

// Güncelleme fonksiyonu
function guncelle() {
  const simdi = new Date();
  const fark = farkHesapla(baslangicTarihi, simdi);

  document.getElementById('duration').textContent =
    `${fark.yil} yıl ${fark.ay} ay ${fark.gun} gün ` +
    `${fark.saat} saat ${fark.dakika} dakika ${fark.saniye} saniye`;
}

// İlk çağrı ve her saniye güncelle
guncelle();
setInterval(guncelle, 1000);
//---------------------------
const heroTitle = document.querySelector('.hero-content h1');
const text = heroTitle.textContent;
heroTitle.textContent = '';
let idx = 0;

function typeWriter() {
  if (idx < text.length) {
    heroTitle.textContent += text.charAt(idx);
    idx++;
    setTimeout(typeWriter, 120);
  }
}

window.onload = typeWriter;
//---------------------------
// Kayan ışık parçacıkları animasyonu

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Kalp çizme fonksiyonu
function drawHeart(ctx, x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -3, -3, -3, -3, 0);
  ctx.bezierCurveTo(-3, 3, 0, 5, 0, 7);
  ctx.bezierCurveTo(0, 5, 3, 3, 3, 0);
  ctx.bezierCurveTo(3, -3, 0, -3, 0, 0);
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 51, 102, ${alpha})`; // Pembe ton
  ctx.shadowColor = `rgba(255, 51, 102, ${alpha})`;
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();
}

// Kalp parçacık sınıfı
class HeartParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = -10 - Math.random() * 100; // ekran üstünden başla
    this.size = 0.8 + Math.random() * 0.8; // 0.8 - 1.6 arasında
    this.speedY = 0.5 + Math.random() * 1; // yavaş aşağı hareket
    this.speedX = (Math.random() - 0.5) * 0.6; // sağa sola hafif sallanma
    this.alpha = 0.2 + Math.random() * 0.5;
    this.alphaChange = 0.002 + Math.random() * 0.003;
    this.alphaIncreasing = Math.random() > 0.5;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    // Sınırlar içinde kal
    if (this.x < 0) this.x = width;
    else if (this.x > width) this.x = 0;

    // Opaklık dalgalanması
    if (this.alphaIncreasing) {
      this.alpha += this.alphaChange;
      if (this.alpha >= 0.7) this.alphaIncreasing = false;
    } else {
      this.alpha -= this.alphaChange;
      if (this.alpha <= 0.2) this.alphaIncreasing = true;
    }

    // Ekranın altına ulaşınca resetle
    if (this.y > height + 20) {
      this.reset();
      this.y = -10;
    }
  }

  draw(ctx) {
    drawHeart(ctx, this.x, this.y, this.size, this.alpha);
  }
}

const heartsCount = 70;
const hearts = [];

for (let i = 0; i < heartsCount; i++) {
  hearts.push(new HeartParticle());
}

function animateHeartsDown() {
  ctx.clearRect(0, 0, width, height);

  hearts.forEach(h => {
    h.update();
    h.draw(ctx);
  });

  requestAnimationFrame(animateHeartsDown);
}

animateHeartsDown();
//---------------------------
