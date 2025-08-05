function selectPlan(planName) {
  const tempUser = JSON.parse(localStorage.getItem("tempUser"));

  if (!tempUser || !tempUser.username || !tempUser.role) {
    alert("Please complete the sign-up process first.");
    window.location.href = "signup.html";
    return;
  }

  // Attach selected membership to temp user
  tempUser.membership = planName;

  // Save the new user into users list
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(tempUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Save session details
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", tempUser.role);
  localStorage.setItem("loggedInUser", tempUser.username);
  localStorage.setItem("userMembership", planName);
  localStorage.removeItem("tempUser");

  // Redirect to the freelancer profile page
  window.location.href = "profile.html";
}
