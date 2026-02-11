let token;
window.onload = () => {
  token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/index.html";
    return
  }
  
  document.querySelector("body").classList.remove("hidden");
};

