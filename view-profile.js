document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");

  if (!username) {
    alert("You must be logged in to view your profile.");
    window.location.href = "login.html";
    return;
  }

  const profileData = JSON.parse(localStorage.getItem(`profile_${username}`));

  if (!profileData) {
    alert("No profile data found. Please complete your profile.");
    window.location.href = "profile.html";
    return;
  }

  document.getElementById("name").textContent = profileData.name || "N/A";
  document.getElementById("address").textContent = profileData.address || "N/A";
  document.getElementById("city").textContent = profileData.city || "N/A";
  document.getElementById("province").textContent = profileData.province || "N/A";
  document.getElementById("postal").textContent = profileData.postalCode || "N/A";
  document.getElementById("contact").textContent = profileData.contact || "N/A";
  document.getElementById("membership").textContent = profileData.membership || "None";

  if (profileData.photo) {
    document.getElementById("photo").textContent = profileData.photo;
  }

  if (profileData.resume) {
    const resumeLink = document.createElement("a");
    resumeLink.href = "#"; // Change this if you add download feature
    resumeLink.textContent = profileData.resume;
    document.getElementById("resume").appendChild(resumeLink);
  }

  if (profileData.certificates && profileData.certificates.length > 0) {
    const certList = document.getElementById("certificates");
    profileData.certificates.forEach(cert => {
      const li = document.createElement("li");
      li.textContent = cert;
      certList.appendChild(li);
    });
  }
});
