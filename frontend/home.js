let token;
window.onload = () => {
  token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  document.querySelector("body").classList.remove("hidden");
  const chatBox = document.getElementById("chatBox");
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
};

async function formSendMessage(event) {
  event.preventDefault()
  const chat = event.target.chat.value;
  if (!chat) {
    alert("Cant proceed with empty input!");
    return;
  }
  try {
    const response = await axios.post(
      "/message/send",
      { chat },
      { headers: { Authorization: token } },
    );

    console.log(response.data.msg);
    event.target.reset();
  } catch (error) {
    console.log(error.response?.data?.message || "Something went wrong");
  }
}
