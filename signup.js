// --- Signup Flow to Membership Page ---
function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.getElementById("userType").value;
  const error = document.getElementById("error");

  error.textContent = "";

  if (!username || !password || !confirmPassword || !role) {
    error.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }

  const tempUser = { username, password, role };
  localStorage.setItem("tempUser", JSON.stringify(tempUser));

  // Redirect to role-based membership page
  if (role === "client") {
    window.location.href = "client-membership.html";
  } else {
    window.location.href = "freelancer-membership.html";
  }
}

// --- Password Visibility Toggle ---
function togglePasswordVisibility() {
  const input = document.getElementById("password");
  const icon = input.nextElementSibling;
  input.type = input.type === "password" ? "text" : "password";
  icon.textContent = input.type === "password" ? "👁️" : "🙈";
}

function toggleConfirmPasswordVisibility() {
  const input = document.getElementById("confirmPassword");
  const icon = input.nextElementSibling;
  input.type = input.type === "password" ? "text" : "password";
  icon.textContent = input.type === "password" ? "👁️" : "🙈";
}

// --- Services Dropdown ---
function toggleDropdown() {
  document.getElementById("dropdown").classList.toggle("show");
}

window.addEventListener("click", function (e) {
  if (!e.target.matches(".dropdown-btn")) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
});

// --- Hide Login Button If Already Logged In ---
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  const loginItem = document.getElementById("loginLink");
  if (user && loginItem) {
    loginItem.style.display = "none";
  }
});
