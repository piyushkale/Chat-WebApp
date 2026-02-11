function toggleSignIn() {
  const signupSection = document.getElementById("signup-section");
  const loginSection = document.getElementById("login-section");

  signupSection.classList.toggle("hidden");
  loginSection.classList.toggle("hidden");
  if (loginSection.classList.contains('hidden')) {
    document.getElementById('toggleBtn').innerText='Login'
  }else{
    document.getElementById('toggleBtn').innerText='Signup'
  }
}
