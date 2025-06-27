
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
