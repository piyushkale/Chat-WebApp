let token;
window.onload = async () => {
  token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  document.querySelector("body").classList.remove("hidden");
  await loadAllMessages();
  const chatBox = document.getElementById("chatBox");
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
};

async function formSendMessage(event) {
  event.preventDefault();
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

async function loadAllMessages() {
  try {
    const response = await axios.get("/message/allMessages", {
      headers: { Authorization: token },
    });
    const messages = response.data.messages;
    const userId = response.data.userId;
    const ul = document.getElementById("chatBox");
    ul.innerHTML = "";
    messages.forEach((message) => {
      const date = new Date(message.createdAt);

      const li = document.createElement("li");
      li.className = `relative text-2xl max-w-[50%] min-w-[20%] p-2 bg-gray-800/80 wrap-anywhere outline-gray-500/50 outline rounded-md`;
      if (message.userId === userId) {
        li.classList.add("self-end");
      } else {
        li.classList.add("self-start");
      }
      li.innerText = `${message.chat}`;
      const spanTime = document.createElement("span");
      spanTime.className = "absolute right-0 -top-6 text-sm opacity-80";
      spanTime.innerText = `${date.toLocaleString()}`;
      const spanName = document.createElement("span");
      spanName.className = "absolute left-0 -top-7 text-lg";
      spanName.innerText = `user ${message.userId === userId ? "You" : message.userId}`;

      li.append(spanTime, spanName);
      ul.appendChild(li);
    });
    displayMessages(userId);
  } catch (error) {
    console.log(error);
  }
}

async function displayMessages(userId) {
  try {
    const response = await axios.get("/message/getMessage", {
      headers: { Authorization: token },
    });

    const message = response.data.message;
    // const userId = response.data.userId;

    const ul = document.getElementById("chatBox");

    const date = new Date(message.createdAt);

    const li = document.createElement("li");
    li.className =
      "relative text-2xl max-w-[50%] min-w-[20%] p-2 bg-gray-800/80 wrap-anywhere outline-gray-500/50 outline rounded-md";

    if (message.userId === userId) {
      li.classList.add("self-end");
    } else {
      li.classList.add("self-start");
    }

    li.innerText = message.chat;

    const spanTime = document.createElement("span");
    spanTime.className = "absolute right-0 -top-6 text-sm opacity-80";
    spanTime.innerText = date.toLocaleString();

    const spanName = document.createElement("span");
    spanName.className = "absolute left-0 -top-7 text-lg";
    spanName.innerText =
      message.userId === userId ? "You" : `user ${message.userId}`;

    li.append(spanTime, spanName);
    ul.appendChild(li);

    ul.scrollTo({
      top: ul.scrollHeight,
      behavior: "smooth",
    });

    // Start waiting again AFTER response
    displayMessages(userId);
  } catch (error) {
    console.log(error);
    setTimeout(() => displayMessages(userId), 2000);
  }
}

// setInterval(() => {
//   displayMessages();
//   const chatBox = document.getElementById("chatBox");
//   chatBox.scrollTo({
//     top: chatBox.scrollHeight,
//     behavior: "smooth",
//   });
// }, 3000);
