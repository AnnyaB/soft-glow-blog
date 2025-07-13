// perks.js

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const segments = [
  "💎 Glow Badge",
  "💌 Compliment",
  "🌸 Mood Boost",
  "🛍️ Surprise Gift",
  "💖 Love Note",
  "✨ Pink Motivation",
  "🎀 Digital Sticker",
  "🌟 Self-Care Quote"
];
const colors = [
  "#f8c6d8", "#f3b5c5", "#fddde6", "#ffe0f0",
  "#f9cce2", "#ffd4dc", "#f7dce7", "#fce4ec"
];
let spinning = false;
let angle = 0;
let prizeIndex = 0;

function drawWheel() {
  const radius = canvas.width / 2;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const anglePerSegment = (2 * Math.PI) / segments.length;

  for (let i = 0; i < segments.length; i++) {
    const startAngle = anglePerSegment * i;
    const endAngle = startAngle + anglePerSegment;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#d86b92";
    ctx.font = "bold 14px Quicksand";
    ctx.fillText(segments[i], radius - 10, 5);
    ctx.restore();
  }

  // Draw center dot
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#d86b92";
  ctx.fill();

  // Draw pointer
  ctx.beginPath();
  ctx.moveTo(centerX - 10, 10);
  ctx.lineTo(centerX, 0);
  ctx.lineTo(centerX + 10, 10);
  ctx.closePath();
  ctx.fillStyle = "#d86b92";
  ctx.fill();
}

drawWheel();

function spinWheel() {
  if (spinning) return;
  spinning = true;
  const spinAngle = Math.floor(Math.random() * 360 + 720); // 2-3 full spins
  const duration = 4000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out
    angle = spinAngle * easedProgress;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const segmentAngle = 360 / segments.length;
      const index = Math.floor(((360 - (angle % 360)) % 360) / segmentAngle);
      prizeIndex = index;
      document.getElementById("prizeText").textContent = `You won: ${segments[index]} 🎉`;
      spinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function showWheel() {
  document.getElementById("wheelModal").style.display = "flex";
  drawWheel();
}

function closeWheel() {
  document.getElementById("wheelModal").style.display = "none";
  document.getElementById("prizeText").textContent = "";
}

function getMoodGift() {
  const moods = [
    "😊 Happy", "😔 Sad", "😴 Tired", "😡 Angry", "😍 In Love",
    "😇 Calm", "😎 Confident", "😢 Emotional"
  ];
  const gifts = [
    "✨ Aesthetic wallpaper just for your mood!",
    "💖 Gentle reminder: You’re enough.",
    "🎧 A 3-minute relaxation clip!",
    "🌈 Daily affirmation generated!",
    "🎀 You got a pink sparkle badge!"
  ];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  const gift = gifts[Math.floor(Math.random() * gifts.length)];
  alert(`${mood}\n${gift}`);
}

function downloadPerk(name) {
  alert("✨ This digital perk will soon be added to your profile as a collectible gift.");
}

function checkStreak() {
  alert("🔥 You're glowing! You've maintained a 3-day streak. Perk will be unlocked soon.");
}


// 💖 Save Perk to MongoDB Wallet
async function savePerkToWallet(name, description) {
  const token = localStorage.getItem("pinkToken");
  if (!token) {
    alert("Please log in to save your perk ✨");
    return;
  }

  try {
    const res = await fetch("/api/wallet/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, description })
    });

    const data = await res.json();
    if (res.ok) {
      alert("🎁 Perk saved to your wallet!");
      loadWallet();
    } else {
      alert("Error saving perk: " + data.message);
    }
  } catch (err) {
    console.error("Save wallet error:", err);
    alert("Something went wrong while saving the perk.");
  }
}

// 💼 Load Wallet Perks for UI
async function loadWallet() {
  const token = localStorage.getItem("pinkToken");
  if (!token) return;

  try {
    const res = await fetch("/api/wallet", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const perks = await res.json();
    renderWallet(perks);
  } catch (err) {
    console.error("Load wallet error:", err);
  }
}

// 🎨 Render Wallet UI
function renderWallet(perks) {
  const container = document.getElementById("walletSection");
  if (!container) return;

  container.innerHTML = `
    <h2 style="text-align: center; color: #d86b92; font-family: 'Quicksand', sans-serif;">💼 Your Wallet</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 30px;">
      ${perks.map(perk => `
        <div style="background: #fff0f6; border-radius: 16px; padding: 20px; box-shadow: 0 0 12px rgba(243, 181, 197, 0.3); text-align: center;">
          <h3 style="color: #d86b92;">${perk.name}</h3>
          <p>${perk.description}</p>
          <small style="display: block; margin: 10px 0; color: #888;">🌸 Earned: ${new Date(perk.dateEarned).toLocaleDateString()}</small>
          <button style="background: #f3b5c5; color: white; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; transition: 0.3s;" onclick="redeemPerk('${perk.name}')">Use Now</button>
        </div>
      `).join('')}
    </div>
  `;
}

// 🎀 Redeem Perk Function
function redeemPerk(perkName) {
  alert(`Redeeming: ${perkName} ✨ Coming soon!`);
}

// 📥 Auto load wallet on page load (optional)
window.addEventListener('DOMContentLoaded', loadWallet);
