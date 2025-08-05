// --------- TOGGLE SERVICE DROPDOWN ---------
document.addEventListener("DOMContentLoaded", function () {
  const serviceBtn = document.querySelector(".services-btn") || document.querySelector(".dropdown-btn");
  const dropdown = document.querySelector(".dropdown");

  if (serviceBtn && dropdown) {
    serviceBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
      if (!e.target.matches(".services-btn") && !e.target.matches(".dropdown-btn")) {
        dropdown.classList.remove("show");
      }
    });
  }

  // --------- NAVBAR USER STATE LOGIC ---------
  const username = localStorage.getItem("loggedInUser");
  const role = localStorage.getItem("userRole");
  const nav = document.getElementById("navLinks");
  const loginLink = document.getElementById("loginLink");
  const postJobNav = document.getElementById("postJobNav");

  if (window.location.pathname.includes("login.html") && loginLink) {
    loginLink.style.display = "none";
  }

  if (username && nav) {
    // Hide Login
    if (loginLink) loginLink.style.display = "none";

    // Add "Hello, username"
    const helloLi = document.createElement("li");
    const helloAnchor = document.createElement("a");
    helloAnchor.textContent = `Hello, ${username}`;
    helloAnchor.href = role === "client"
      ? "client-dashboard.html"
      : `view-profile.html?user=${username}`;
    helloLi.appendChild(helloAnchor);
    nav.appendChild(helloLi);

    // Add "Logout"
    const logoutLi = document.createElement("li");
    const logoutAnchor = document.createElement("a");
    logoutAnchor.textContent = "Logout";
    logoutAnchor.href = "#";
    logoutAnchor.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userRole");
      window.location.href = "login.html";
    };
    logoutLi.appendChild(logoutAnchor);
    nav.appendChild(logoutLi);

    // Show Post Job for client only
    if (role === "client" && postJobNav) {
      postJobNav.style.display = "inline-block";
    }
  }
});
