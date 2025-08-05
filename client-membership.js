function selectPlan(planName) {
  const tempUser = JSON.parse(localStorage.getItem("tempUser"));
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userRole = localStorage.getItem("userRole");

  // Case 1: User just signed up and is being redirected to choose a plan
  if (tempUser) {
    tempUser.membership = planName;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(tempUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", tempUser.username);
    localStorage.setItem("userRole", tempUser.role);
    localStorage.setItem("userMembership", planName);
    localStorage.removeItem("tempUser");

    // Redirect to appropriate profile creation page
    if (tempUser.role === "client") {
      window.location.href = "client-profile.html";
    } else {
      window.location.href = "profile.html";
    }

    return;
  }

  // Case 2: Existing logged-in user selecting or updating a plan
  if (loggedInUser && userRole) {
    localStorage.setItem("userMembership", planName);

    if (userRole === "client") {
      window.location.href = "client-dashboard.html";
    } else {
      window.location.href = "view-profile.html";
    }

    return;
  }

  // Case 3: No session — redirect to sign up
  alert("Please sign up or log in first.");
  window.location.href = "signup.html";
}
