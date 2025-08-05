// --------- TOGGLE DROPDOWN ---------
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.classList.toggle("show");
}

// --------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------
window.addEventListener("click", function (e) {
  if (!e.target.matches(".dropdown-btn")) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
});

// --------- NAVBAR USER DISPLAY + LOGOUT ---------
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  const role = localStorage.getItem("userRole");
  const nav = document.getElementById("navLinks");

  if (username && nav) {
    const existingUserLink = nav.querySelector(".user-link");
    const existingLogoutLink = nav.querySelector(".logout-link");
    if (existingUserLink) existingUserLink.remove();
    if (existingLogoutLink) existingLogoutLink.remove();

    const loginLink = nav.querySelector('#loginLink');
    if (loginLink) loginLink.style.display = "none";

    const userItem = document.createElement("li");
    const userLink = document.createElement("a");
    userLink.href = role === "client" ? "client-dashboard.html" : `view-profile.html?user=${username}`;
    userLink.textContent = `Hello, ${username}`;
    userLink.classList.add("user-link");
    userItem.appendChild(userLink);
    nav.appendChild(userItem);

    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLink.classList.add("logout-link");
    logoutLink.onclick = logout;
    logoutItem.appendChild(logoutLink);
    nav.appendChild(logoutItem);
  }

  // --------- Show Membership Info (if any) ---------
  const membershipInfo = document.getElementById("membershipInfo");
  const userMembership = localStorage.getItem("userMembership");
  if (membershipInfo && userMembership) {
    membershipInfo.textContent = `Membership Plan: ${userMembership}`;
  }

  // --------- Role-based Field Display ---------
  const roleType = localStorage.getItem("userRole");
  document.getElementById("freelancerFields").style.display = roleType === "freelancer" ? "block" : "none";
  document.getElementById("clientFields").style.display = roleType === "client" ? "block" : "none";

  // --------- PROFILE FORM LOGIC ---------
  const form = document.getElementById("profileForm");
  if (!form) return;

  // File name display handlers
  function displayFileName(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (input && display) {
      input.addEventListener("change", () => {
        const files = Array.from(input.files || []);
        display.textContent = files.map(f => f.name).join(", ") || "No file chosen";
      });
    }
  }

  displayFileName("profilePhoto", "photo-name");
  displayFileName("resume", "resume-name");
  displayFileName("certificates", "certificates-name");
  displayFileName("businessLogo", "logo-name");

  const mockAddressMap = {
    "123 King St": { city: "Toronto", province: "Ontario", postal: "M5V 1E1" },
    "456 Main St": { city: "Vancouver", province: "British Columbia", postal: "V5K 0A1" },
    "789 Saint Laurent": { city: "Montreal", province: "Quebec", postal: "H2X 3W1" }
  };

  const addressInput = document.getElementById("address");
  const citySelect = document.getElementById("city");
  const provinceSelect = document.getElementById("province");
  const postalInput = document.getElementById("postalCode");

  if (addressInput) {
    addressInput.addEventListener("blur", () => {
      const input = addressInput.value.trim();
      if (mockAddressMap[input]) {
        citySelect.value = mockAddressMap[input].city;
        provinceSelect.value = mockAddressMap[input].province;
        postalInput.value = mockAddressMap[input].postal;
      }
    });
  }

  // --------- Save Profile ---------
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = localStorage.getItem("loggedInUser");
    const roleType = localStorage.getItem("userRole");

    if (!username || !roleType) {
      alert("User not logged in.");
      return;
    }

    let profileData = {
      membership: localStorage.getItem("userMembership") || "None"
    };

    if (roleType === "freelancer") {
      profileData = {
        ...profileData,
        name: document.getElementById("fullName").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: citySelect.value.trim(),
        province: provinceSelect.value.trim(),
        postalCode: postalInput.value.trim(),
        contact: document.getElementById("contact").value.trim(),
        photo: document.getElementById("profilePhoto").files[0]?.name || null,
        resume: document.getElementById("resume").files[0]?.name || null,
        certificates: Array.from(document.getElementById("certificates").files || []).map(f => f.name)
      };
    }

    if (roleType === "client") {
      profileData = {
        ...profileData,
        companyName: document.getElementById("companyName").value.trim(),
        businessAddress: document.getElementById("businessAddress").value.trim(),
        businessLogo: document.getElementById("businessLogo").files[0]?.name || null,
        description: document.getElementById("description").value.trim()
      };
    }

    localStorage.setItem(`profile_${username}`, JSON.stringify(profileData));
    alert("Profile saved successfully!");
    window.location.href = "view-profile.html";
  });
});

// --------- LOGOUT FUNCTION ---------
function logout() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
