
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

