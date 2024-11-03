const eye = document.querySelector("form .form span.eye");
const icon = document.querySelector("form .form span.eye img");

const username = document.getElementById("username");
const password = document.getElementById("password");

const usernameLabel = document.querySelector('label[for="username"]');
const passwordLabel = document.querySelector('label[for="password"]');

eye.addEventListener("click", function () {
  this.classList.toggle("active");

  if (this.classList.contains("active")) {
    icon.setAttribute("src", "eye-slash.svg");
    password.setAttribute("type", "text");
  } else {
    icon.setAttribute("src", "eye-regular.svg");
    password.setAttribute("type", "password");
  }
});

username.addEventListener("input", () => {
  usernameLabel.classList.toggle("active", username.value !== "");
});

password.addEventListener("input", () => {
  passwordLabel.classList.toggle("active", password.value !== "");
});

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.getElementById("messages");

  if (messages && messages.textContent.trim() !== "") {
    messages.classList.add("show");

    setTimeout(() => {
      messages.classList.remove("show");
    }, 3000);
  }
});
