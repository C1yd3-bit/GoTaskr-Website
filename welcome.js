// --------- TOGGLE DROPDOWN ---------
function toggleServiceDropdown() {
  const dropdown = document.getElementById("dropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

// --------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------
window.addEventListener("click", function (e) {
  if (!e.target.matches('.dropdown-btn')) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
});

// --------- NAVBAR LOGIC ON LOAD ---------
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  const role = localStorage.getItem("userRole");
  const currentPage = window.location.pathname;

  const nav = document.getElementById("navLinks");
  const loginNav = document.getElementById("loginNav");
  const postJobBtn = document.getElementById("postJobBtn");
  const postJobNav = document.getElementById("postJobNav");
  const findJobBtn = document.getElementById("findJobBtn");
  const subtitle = document.getElementById("welcomeSubtitle");

  // Hide login link on login page
  if (currentPage.includes("login.html") && loginNav) {
    loginNav.style.display = "none";
  }

  // If user is logged in
  if (username && nav) {
    // Prevent duplicates
    const existingHello = nav.querySelector(".hello-user");
    const existingLogout = nav.querySelector(".logout-link");
    if (!existingHello) {
      const helloLi = document.createElement("li");
      const helloLink = document.createElement("a");
      helloLink.textContent = `Hello, ${username}`;
      helloLink.href = role === "client"
        ? "client-dashboard.html"
        : `view-profile.html?user=${username}`;
      helloLink.classList.add("hello-user");
      helloLi.appendChild(helloLink);
      nav.appendChild(helloLi);
    }

    if (!existingLogout) {
      const logoutLi = document.createElement("li");
      const logoutLink = document.createElement("a");
      logoutLink.textContent = "Logout";
      logoutLink.href = "#";
      logoutLink.classList.add("logout-link");
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userRole");
        window.location.href = "login.html";
      });
      logoutLi.appendChild(logoutLink);
      nav.appendChild(logoutLi);
    }

    if (loginNav) loginNav.style.display = "none";

    // Show/Hide buttons based on user role
    if (role === "client") {
      if (postJobBtn) postJobBtn.style.display = "inline-block";
      if (postJobNav) postJobNav.style.display = "inline-block";
      if (findJobBtn) findJobBtn.style.display = "none";
      if (subtitle) subtitle.textContent = "Find Professional Workers, anytime.";
    }
  }
});
