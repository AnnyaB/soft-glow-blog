
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


/*contact form submission handling*/
// Ensure the backend server is running at http://localhost:3000
// and the endpoint /send-message is set up to handle POST requests.
// The backend code should be similar to the one provided in the initial comment.
// Make sure to replace the email credentials in the .env file with your own.
// The backend should be set up to use nodemailer for sending emails.
// The frontend code below will handle the form submission and display success or error messages.
// This code assumes you have a backend server running that can handle the POST request to /send-message.
// The backend should be set up to use nodemailer for sending emails.
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
