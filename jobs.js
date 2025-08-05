document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userRole = localStorage.getItem("userRole") || "";
  const isClient = userRole === "client";

  const dropdownBtn = document.querySelector(".dropdown-btn");
  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dd = document.getElementById("dropdown");
      if (dd) dd.classList.toggle("show");
    });
  }

  const jobList = document.getElementById("jobList");
  const jobDetails = document.getElementById("jobDetails");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearFiltersBtn");
  const sortSelect = document.getElementById("sortBy");

  let jobs = JSON.parse(localStorage.getItem("jobPosts")) || [];

  if (searchInput) {
    searchInput.addEventListener("input", renderJobs);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      renderJobs();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", renderJobs);
  }

  function saveJobsToLocal() {
    localStorage.setItem("jobPosts", JSON.stringify(jobs));
  }

  function renderJobs() {
    const searchQuery = searchInput?.value.trim().toLowerCase();
    jobList.innerHTML = "";

    let visibleJobs = isClient
      ? jobs.filter(job => job.postedBy === loggedInUser)
      : jobs;

    if (searchQuery) {
      visibleJobs = visibleJobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery) ||
        (job.category || "").toLowerCase().includes(searchQuery) ||
        (job.location || "").toLowerCase().includes(searchQuery) ||
        (job.description || "").toLowerCase().includes(searchQuery)
      );
    }

    const sortBy = sortSelect?.value || "date";
    if (sortBy === "rate") {
      visibleJobs.sort((a, b) => parseFloat(b.rate || 0) - parseFloat(a.rate || 0));
    } else {
      visibleJobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    }

    if (visibleJobs.length === 0) {
      jobList.innerHTML = "<p>No jobs found.</p>";
      jobDetails.innerHTML = "";
      return;
    }

    visibleJobs.forEach((job, index) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.setAttribute("data-category", job.category?.toLowerCase() || "");

      const now = new Date();
      const postedDate = new Date(job.datePosted);
      const expireDate = job.expiration ? new Date(job.expiration) : null;
      const daysSincePosted = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));
      const daysUntilExpire = expireDate ? Math.floor((expireDate - now) / (1000 * 60 * 60 * 24)) : null;

      let badge = "";
      if (daysSincePosted <= 2 && daysUntilExpire !== null && daysUntilExpire <= 2) {
        badge = `<span class="badge urgent" title="Recently posted and expiring soon">Urgent</span>`;
      } else if (daysUntilExpire !== null && daysUntilExpire <= 2) {
        badge = `<span class="badge expiring" title="This job post will expire soon">Expiring</span>`;
      } else if (daysSincePosted <= 2) {
        badge = `<span class="badge new" title="This job was posted recently">New</span>`;
      }

      card.innerHTML = `
        <div class="card-header">
          <h3>${job.title}</h3>
          ${badge}
        </div>
        <p><strong>Location:</strong> ${job.location || "N/A"}</p>
        <p><strong>Category:</strong> ${job.category || "N/A"}</p>
        <p><strong>Rate:</strong> $${job.rate || "N/A"}</p>
        <p><strong>Expires:</strong> ${job.expiration || "N/A"}</p>
      `;

      card.addEventListener("click", () => {
        document.querySelectorAll(".job-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        showJobDetails(job);
      });

      jobList.appendChild(card);
    });

    document.querySelector(".job-card")?.classList.add("selected");
    showJobDetails(visibleJobs[0]);
  }

  function showJobDetails(job) {
    const index = jobs.findIndex(j =>
      j.title === job.title &&
      j.postedBy === job.postedBy &&
      j.datePosted === job.datePosted
    );

    jobs[index].applicants = jobs[index].applicants || [];

    jobDetails.classList.remove("show");
    void jobDetails.offsetWidth;

    if (isClient && job.isEditing) {
      jobDetails.innerHTML = `
        <h2>Edit Job</h2>
        <input class="edit-input" value="${job.title}" id="edit-title-${index}">
        <input class="edit-input" value="${job.location || ""}" id="edit-location-${index}">
        <input class="edit-input" value="${job.category || ""}" id="edit-category-${index}">
        <input class="edit-input" value="${job.rate || ""}" id="edit-rate-${index}">
        <input class="edit-input" type="date" value="${job.expiration || ""}" id="edit-expiration-${index}">
        <textarea class="edit-textarea" id="edit-description-${index}">${job.description || ""}</textarea>
        <div class="action-buttons">
          <button class="save-btn" onclick="saveEdit(${index})">Save</button>
          <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
        </div>
      `;
      jobDetails.classList.add("show");
      return;
    }

    const applicantsHTML = jobs[index].applicants.length
      ? jobs[index].applicants.map(a =>
          typeof a === "string"
            ? `<li>${a}</li>`
            : `<li>${a.name} - <a href="${a.resumeUrl}" target="_blank">Resume</a></li>`
        ).join("")
      : "<li>No applicants yet.</li>";

    jobDetails.innerHTML = `
      <h2>${job.title}</h2>
      <p><strong>Posted by:</strong> ${job.companyName || job.postedBy}</p>
      ${job.companyLogo ? `<img src="${job.companyLogo}" alt="Company Logo" style="max-width: 120px; margin: 10px 0;" />` : ""}
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Category:</strong> ${job.category}</p>
      <p><strong>Rate:</strong> $${job.rate}</p>
      <p><strong>Description:</strong> ${job.description}</p>
      <p><strong>Expires on:</strong> ${job.expiration}</p>
      <p style="font-size: 0.8rem; opacity: 0.7;">Posted on: ${job.datePosted}</p>

      ${
        isClient
          ? `<div class="action-buttons">
               <button class="edit-btn" onclick="editJob(${index})">Edit</button>
               <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
             </div>
             <div class="applicants">
               <strong>Applicants:</strong>
               <ul>${applicantsHTML}</ul>
             </div>`
          : `<div class="action-buttons">
               <button class="apply-btn" id="applyBtn">Apply</button>
             </div>`
      }
    `;

    jobDetails.classList.add("show");

    if (!isClient) {
      const alreadyApplied = jobs[index].applicants.some(a =>
        (typeof a === "string" && a === loggedInUser) ||
        (typeof a === "object" && a.name === loggedInUser)
      );

      const applyBtn = document.getElementById("applyBtn");
      if (alreadyApplied) {
        applyBtn.disabled = true;
        applyBtn.textContent = "Already Applied";
      }

      applyBtn?.addEventListener("click", () => {
        if (!loggedInUser) {
          alert("Please log in to apply.");
          window.location.href = "login.html";
          return;
        }

        const resumeUrl = prompt("Paste the URL to your resume (optional):");
        const applicantEntry = resumeUrl
          ? { name: loggedInUser, resumeUrl }
          : loggedInUser;

        jobs[index].applicants.push(applicantEntry);
        saveJobsToLocal();
        alert("✅ Application submitted!");
        renderJobs();
      });
    }
  }

  window.editJob = function (index) {
    if (!isClient) return;
    jobs[index].isEditing = true;
    saveJobsToLocal();
    renderJobs();
  };

  window.saveEdit = function (index) {
    if (!isClient) return;
    jobs[index] = {
      ...jobs[index],
      title: document.getElementById(`edit-title-${index}`).value.trim(),
      location: document.getElementById(`edit-location-${index}`).value.trim(),
      category: document.getElementById(`edit-category-${index}`).value.trim(),
      rate: document.getElementById(`edit-rate-${index}`).value.trim(),
      expiration: document.getElementById(`edit-expiration-${index}`).value,
      description: document.getElementById(`edit-description-${index}`).value.trim(),
      isEditing: false
    };
    saveJobsToLocal();
    renderJobs();
  };

  window.deleteJob = function (index) {
    if (!isClient) return;
    if (confirm("Are you sure you want to delete this job?")) {
      jobs.splice(index, 1);
      saveJobsToLocal();
      renderJobs();
    }
  };

  renderJobs();
});

// Close dropdown on outside click
window.addEventListener("click", (e) => {
  if (!e.target.matches(".dropdown-btn")) {
    const dropdown = document.getElementById("dropdown");
    if (dropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
});
