async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phn = document.getElementById("number").value;
  const password = document.getElementById("password").value;
  try {
    const res = await axios.post("/user/signup", {
      name,
      email,
      phn,
      password,
    });
    if (res.data.message) {
      displayStatus("success", res.data.message);
    }
    console.log(res.data.message);
    event.target.reset();
  } catch (error) {
    console.log(error.response.data.message);
    displayStatus("fail", error.response.data.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const credential = document.getElementById("l-cred").value;
  const password = document.getElementById("l-password").value;
  try {
    const response = await axios.post("/user/login", { credential, password });
    if (response.data.token) {
      displayStatus("success", response.data.message);
      localStorage.setItem("token", response.data.token);
      window.location.href = "/home.html";
    }
    event.target.reset();
  } catch (error) {
    displayStatus(
      "fail",
      error.response?.data?.message || "Something went wrong",
    );
  }
}

function toggleSignIn() {
  const signupSection = document.getElementById("signup-section");
  const loginSection = document.getElementById("login-section");

  signupSection.classList.toggle("md:hidden");
  signupSection.classList.toggle("hidden");
  loginSection.classList.toggle("hidden");
  loginSection.classList.toggle("md:flex");
  if (loginSection.classList.contains("hidden")) {
    document.getElementById("toggleBtn").innerText = "Login";
  } else {
    document.getElementById("toggleBtn").innerText = "Signup";
  }
}

function displayStatus(status, message) {
  let vanishDiv;
  if (status == "success") {
    const divStatus = document.getElementById("status");
    divStatus.innerText = message;
    divStatus.classList.add("text-emerald-600");
    vanishDiv = divStatus;
  }
  if (status == "fail") {
    const divStatus = document.getElementById("status");
    divStatus.innerText = message;
    divStatus.classList.add("text-red-500");
    vanishDiv = divStatus;
  }

  setTimeout(() => {
    vanishDiv.innerText = "";
  }, 3000);
}
