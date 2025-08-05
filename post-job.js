document.addEventListener("DOMContentLoaded", () => {
  // --- Services Dropdown Toggle ---
  const dropdownBtn = document.querySelector(".dropdown-btn");
  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("dropdown")?.classList.toggle("show");
    });
  }

  // --- Close dropdown when clicking outside ---
  window.addEventListener("click", (e) => {
    const dropdown = document.getElementById("dropdown");
    if (
      dropdown?.classList.contains("show") &&
      !e.target.closest(".dropdown") &&
      !e.target.classList.contains("dropdown-btn")
    ) {
      dropdown.classList.remove("show");
    }
  });

  // --- Check Client Login and Adjust Nav ---
  const username = localStorage.getItem("loggedInUser");
  const role = localStorage.getItem("userRole");
  const loginNav = document.getElementById("loginNav");
  const helloUser = document.getElementById("helloUser");
  const helloUserLink = document.getElementById("helloUserLink");

  if (username && role === "client") {
    if (helloUser && helloUserLink) {
      helloUser.style.display = "inline-block";
      helloUserLink.textContent = `Hello, ${username}`;
      helloUserLink.href = "view-profile.html";
    }
    if (loginNav) {
      loginNav.innerHTML = `<a href="#">Logout</a>`;
      loginNav.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userRole");
        window.location.href = "login.html";
      };
    }
  } else {
    alert("Only clients can post jobs. Please log in as a client.");
    window.location.href = "login.html";
    return;
  }

  // --- Hide "Post Job" link if on post-job.html ---
  const navLinks = document.getElementById("navLinks");
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "post-job.html" && navLinks) {
    const postJobItem = Array.from(navLinks.querySelectorAll("a")).find(
      (a) => a.getAttribute("href") === "post-job.html"
    );
    postJobItem?.parentElement?.remove();
  }

  // --- Job Post Submission Logic ---
  const form = document.getElementById("postJobForm");
  const successMsg = document.getElementById("successMsg");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const category = document.getElementById("category").value.trim();
    const rate = document.getElementById("rate").value.trim();
    const description = document.getElementById("description").value.trim();
    const expiration = document.getElementById("expiration").value;

    if (!title || !category || !description || !expiration) {
      alert("Please fill in all required fields.");
      return;
    }

    const clientProfile = JSON.parse(localStorage.getItem(`clientProfile_${username}`)) || {};

    const job = {
      title,
      location,
      category,
      rate,
      description,
      expiration,
      datePosted: new Date().toLocaleString(),
      postedBy: username,
      applicants: [],
      companyName: clientProfile.companyName || "Unknown Company",
      companyLogo: clientProfile.logo || ""
    };

    const jobs = JSON.parse(localStorage.getItem("jobPosts")) || [];
    jobs.push(job);
    localStorage.setItem("jobPosts", JSON.stringify(jobs));

    if (successMsg) {
      successMsg.textContent = "✅ Job posted successfully! Redirecting to dashboard...";
      successMsg.style.display = "block";
    }

    setTimeout(() => {
      window.location.href = "client-dashboard.html";
    }, 2000);
  });
});
