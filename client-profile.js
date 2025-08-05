// Membership Plan Handler (already existing)
function selectPlan(planName) {
  const tempUser = JSON.parse(localStorage.getItem("tempUser"));

  if (tempUser) {
    tempUser.membership = planName;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(tempUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", tempUser.role);
    localStorage.setItem("loggedInUser", tempUser.username);
    localStorage.setItem("userMembership", planName);
    localStorage.removeItem("tempUser");

    window.location.href = "client-profile.html";
    return;
  }

  const username = localStorage.getItem("loggedInUser");
  if (username) {
    localStorage.setItem("userMembership", planName);
    alert(`You have selected the ${planName} plan!`);
    window.location.href = "client-dashboard.html";
    return;
  }

  alert("Please sign up or log in first.");
  window.location.href = "signup.html";
}

// ✅ Show selected logo file name
document.addEventListener("DOMContentLoaded", () => {
  const logoInput = document.getElementById("logo");
  const logoName = document.getElementById("logo-name");

  if (logoInput && logoName) {
    logoInput.addEventListener("change", function () {
      logoName.textContent = this.files.length > 0 ? this.files[0].name : "No file chosen";
    });
  }

  // ✅ Handle Save Business Profile form submission
  const form = document.getElementById("clientProfileForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = localStorage.getItem("loggedInUser");
    if (!username) {
      alert("User not logged in.");
      return;
    }

    const companyName = document.getElementById("businessName").value.trim();
    const description = document.getElementById("businessDescription").value.trim();
    const businessAddress = document.getElementById("businessAddress").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const logoFile = document.getElementById("logo").files[0];

    // Convert logo to base64 (optional, but useful for display later)
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function () {
        const logoBase64 = reader.result;

        const companyData = {
          companyName,
          description,
          businessAddress,
          contact,
          logo: logoBase64
        };

        localStorage.setItem(`${username}_clientProfile`, JSON.stringify(companyData));
        window.location.href = "client-dashboard.html";
      };
      reader.readAsDataURL(logoFile);
    } else {
      // No logo provided
      const companyData = {
        companyName,
        description,
        businessAddress,
        contact,
        logo: null
      };

      localStorage.setItem(`${username}_clientProfile`, JSON.stringify(companyData));
      window.location.href = "client-dashboard.html";
    }
  });
});
