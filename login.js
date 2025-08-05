document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  const userRole = localStorage.getItem("userRole");

  // Show client profile
  const profile = JSON.parse(localStorage.getItem("clientProfile")) || {};
  document.getElementById("businessName").textContent = profile.businessName || "N/A";
  document.getElementById("description").innerHTML = profile.description || "N/A";
  document.getElementById("location").textContent = profile.location || "N/A";
  document.getElementById("contact").textContent = profile.contact || "N/A";
  if (profile.logo) {
    const logo = document.getElementById("companyLogo");
    logo.src = profile.logo;
    logo.style.display = "block";
  }

  // Load job posts
  const jobList = document.getElementById("jobList");
  const jobs = JSON.parse(localStorage.getItem("jobPosts")) || [];
  const clientJobs = jobs.filter(job => job.postedBy === username);

  clientJobs.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Category:</strong> ${job.category}</p>
      <p><strong>Rate:</strong> $${job.rate}</p>
      <p><strong>Description:</strong><br>${job.description}</p>
      <p><strong>Expires on:</strong> ${job.expiration || "N/A"}</p>
      <button class="edit-btn" data-index="${index}">Edit</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    jobList.appendChild(card);
  });

  // Edit modal logic
  const modal = document.getElementById("editJobModal");
  const closeModal = document.querySelector(".close");

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const job = clientJobs[index];

      document.getElementById("editTitle").value = job.title;
      document.getElementById("editLocation").value = job.location;
      document.getElementById("editCategory").value = job.category;
      document.getElementById("editRate").value = job.rate;
      document.getElementById("editDescription").value = job.description;
      document.getElementById("editExpiration").value = job.expiration || "";

      modal.style.display = "block";
      modal.dataset.index = index;
    });
  });

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  document.getElementById("editJobForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const index = modal.dataset.index;
    const updatedJob = {
      ...clientJobs[index],
      title: document.getElementById("editTitle").value,
      location: document.getElementById("editLocation").value,
      category: document.getElementById("editCategory").value,
      rate: parseFloat(document.getElementById("editRate").value),
      description: document.getElementById("editDescription").value,
      expiration: document.getElementById("editExpiration").value,
    };

    const allJobs = JSON.parse(localStorage.getItem("jobPosts")) || [];
    const jobGlobalIndex = allJobs.findIndex(
      job => job.postedBy === username && job.title === clientJobs[index].title
    );

    if (jobGlobalIndex !== -1) {
      allJobs[jobGlobalIndex] = updatedJob;
      localStorage.setItem("jobPosts", JSON.stringify(allJobs));
    }

    modal.style.display = "none";
    location.reload();
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const allJobs = JSON.parse(localStorage.getItem("jobPosts")) || [];
      const jobToDelete = clientJobs[index];
      const newJobs = allJobs.filter(job =>
        !(job.postedBy === username && job.title === jobToDelete.title)
      );
      localStorage.setItem("jobPosts", JSON.stringify(newJobs));
      location.reload();
    });
  });
});

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}
