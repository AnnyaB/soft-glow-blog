
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleMode");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Optionally update button text/icon
    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "Switch to Light Mode";
    } else {
      toggleBtn.textContent = "Switch to Dark Mode";
    }
  });
});

document.getElementById("visionForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("boardTitle").value;
  const note = document.getElementById("boardNote").value;
  const imageInput = document.getElementById("boardImage");
  const container = document.getElementById("boardsContainer");

  if (!imageInput.files || !imageInput.files[0]) {
    alert("Please select an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const board = document.createElement("div");
    board.classList.add("board");

    board.innerHTML = `
      <button class="delete-btn" onclick="this.parentElement.remove()">✖</button>
      <img src="${event.target.result}" alt="Vision Image" />
      <h4>${title}</h4>
      <p>${note}</p>
    `;

    container.prepend(board); // Add to top
    document.getElementById("visionForm").reset();
  };

  reader.readAsDataURL(imageInput.files[0]);
});

const scrollBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
};

scrollBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const response = await fetch("http://localhost:3000/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  });

  const result = await response.json();
  const messageBox = document.getElementById("formMessage");

  if (result.success) {
    messageBox.textContent = "Message sent successfully!";
    messageBox.style.color = "green";
    this.reset();
  } else {
    messageBox.textContent = "Something went wrong. Try again later.";
    messageBox.style.color = "red";
  }
});

document.querySelectorAll('.mood-card').forEach(img => {
  img.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 9999;

    const modalImg = document.createElement('img');
    modalImg.src = img.src;
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    modalImg.style.borderRadius = '16px';
    modalImg.style.boxShadow = '0 8px 30px rgba(255,255,255,0.3)';

    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    modal.addEventListener('click', () => document.body.removeChild(modal));
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // 🌙 TOGGLE LIGHT/DARK MODE
  const toggleBtn = document.getElementById("toggleMode");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "Switch to Light Mode";
    } else {
      toggleBtn.textContent = "Switch to Dark Mode";
    }
  });

  // 📷 LIGHTBOX for Moodboard
  document.querySelectorAll('.mood-card img').forEach(img => {
    img.addEventListener('click', () => {
      if (document.getElementById('lightbox')) return;

      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox';

      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      lightbox.appendChild(imgClone);
      document.body.appendChild(lightbox);

      lightbox.addEventListener('click', () => {
        lightbox.remove();
      });
    });
  });

  // ⬆️ SCROLL-TO-TOP BUTTON
  const scrollBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
