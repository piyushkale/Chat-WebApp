let token;
let socket;
let currentUserId;
let currentReceiverId;
let currentRoom;
let activeUserElement;
window.onload = async () => {
  token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/index.html";
    return;
  }
  document.querySelector("body").classList.remove("hidden");

  // create socket connection
  socket = io({
    auth: { token },
  });
  socket.on("connect", () => {
    console.log("Connected to Socket server");
    console.log("Socket ID:", socket.id);
  });
  socket.on("message", handlePublicMessage);

  socket.on("privateMessage", handlePrivateMessage);
  displayAllUsers();
};

function handlePrivateMessage(data) {
  const chat = data.url || data.chat;
  const senderId = data.userId;
  const createdAt = data.createdAt;
  const userName = data.userName;
  const receiverId = data.receiverId;
  const isMedia = data.messageType === "Media";
  if (
    (senderId === currentReceiverId && receiverId === currentUserId) ||
    (senderId === currentUserId && receiverId === currentReceiverId)
  ) {
    currentRoomMessages(chat, senderId, createdAt, userName, isMedia);
  }
}

function handlePublicMessage(data) {
  if (currentReceiverId) return;
  const chat = data.url || data.chat;
  const senderId = data.userId;
  const createdAt = data.createdAt;
  const userName = data.userName;
  const isMedia = data.messageType === "Media";

  currentRoomMessages(chat, senderId, createdAt, userName, isMedia);
}

async function displayAllUsers() {
  const section = document.getElementById("users-section");
  const response = await axios.get("/user/allUsers", {
    headers: { Authorization: token },
  });

  const users = response.data.users;
  currentUserId = response.data.userId;
  users.forEach((user) => {
    const h2 = document.createElement("h2");
    if (user.id === currentUserId) {
    }
    h2.innerText = user.id === currentUserId ? `${user.name} (You)` : user.name;
    // h2.innerText = user.name;
    section.appendChild(h2);
    h2.onclick = () => {
      currentReceiverId = user.id;
      if (activeUserElement) {
        activeUserElement.classList.remove("invert");
      }
      h2.classList.add("invert");
      activeUserElement = h2;
      displayPersonalMessages(currentUserId, currentReceiverId);
    };
  });
}

async function displayPersonalMessages(currentUserId, currentReceiverId) {
  try {
    const response = await axios.get("/message/personalMessages", {
      params: {
        senderId: currentUserId,
        receiverId: currentReceiverId,
      },
      headers: { Authorization: token },
    });
    const messages = response.data.messages;
    currentUserId = response.data.userId;
    const ul = document.getElementById("chatBox");
    ul.innerHTML = "";
    messages.forEach((message) => {
      const isMedia = message.messageType === "Media";
      const chat = message.url || message.chat;
      const senderId = message.userId;
      const createdAt = message.createdAt;
      const userName = message.sender.name;
      createLiElement(chat, senderId, createdAt, userName, isMedia, ul);
    });

    ul.scrollTo({
      top: ul.scrollHeight,
      behavior: "smooth",
    });
  } catch (error) {
    console.log(error);
  }
}

function formSendMessage(event) {
  event.preventDefault();
  const chat = event.target.chat.value;
  if (!chat) {
    alert("Cant proceed with empty input!");
    return;
  }
  try {
    if (currentReceiverId) {
      socket.emit("privateMessage", { chat, receiverId: currentReceiverId });
      event.target.reset();
      return;
    }
    socket.emit("message", { chat });
    event.target.reset();
  } catch (error) {
    console.log(error.response?.data?.message || "Something went wrong");
  }
}

// uploading media
async function sendFile() {
  // make post request and send a file and get file url in response and senderId /receiverId
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];
  if (!file) {
    alert("Add a image");
    return;
  }
  const formData = new FormData();
  formData.append("media", file);
  formData.append("receiverId", currentReceiverId ? currentReceiverId : null);
  try {
    const res = await axios.post("/message/sendMedia", formData, {
      headers: { Authorization: token },
    });
    if (currentReceiverId) {
      socket.emit("privateMessage", { res: res.data });
    } else {
      socket.emit("message", { res: res.data });
    }
    fileInput.value = "";
  } catch (error) {
    console.error(error.message);
  }
}

function handleJoinRoom(event) {
  event.preventDefault();
  const email = event.target.email.value;
  socket.emit("join-room", email);
  currentRoom = email;
  document.getElementById("chatBox").innerHTML = "";
  event.target.reset();
}

async function loadAllMessages() {
  currentReceiverId = null;
  const public_chat_h2 = document.getElementById("public-chat-h2");
  if (activeUserElement) {
    activeUserElement.classList.remove("invert");
  }
  public_chat_h2.classList.add("invert");
  activeUserElement = public_chat_h2;

  try {
    const response = await axios.get("/message/allMessages", {
      headers: { Authorization: token },
    });

    const messages = response.data.messages;
    currentUserId = response.data.userId;
    const ul = document.getElementById("chatBox");
    ul.innerHTML = "";
    messages.forEach((message) => {
      const isMedia = message.messageType === "Media";
      const chat = message.url || message.chat;
      const senderId = message.userId;
      const createdAt = message.createdAt;
      const userName = message.sender.name;
      createLiElement(chat, senderId, createdAt, userName, isMedia, ul);
    });

    ul.scrollTo({
      top: ul.scrollHeight,
      behavior: "smooth",
    });
  } catch (error) {
    console.log(error);
  }
}

function currentRoomMessages(chat, senderId, createdAt, userName, isMedia) {
  const ul = document.getElementById("chatBox");

  createLiElement(chat, senderId, createdAt, userName, isMedia, ul);
  ul.scrollTo({
    top: ul.scrollHeight,
    behavior: "smooth",
  });
}

function createLiElement(chat, senderId, createdAt, userName, isMedia, ul) {
  const date = new Date(createdAt);

  if (isMedia) {
    const li = document.createElement("li");
    li.className = `relative text-md max-md:w-[75%] md:max-w-[50%] md:min-w-[25%] p-2 wrap-anywhere outline-gray-500/50 outline rounded-md`;
    if (senderId === currentUserId) {
      li.classList.add("self-end", "bg-gray-500/40");
    } else {
      li.classList.add("self-start", "bg-gray-800/80");
    }
    const img = document.createElement("img");
    img.src = chat;
    img.className = "w-80 h-60 object-cover rounded-lg";
    const spanTime = document.createElement("span");
    spanTime.className = "absolute right-0 -top-6 text-sm opacity-80";
    spanTime.innerText = `${date.toLocaleString()}`;
    const spanName = document.createElement("span");
    spanName.className = "absolute left-0 -top-7 text-lg";
    spanName.innerText = senderId === currentUserId ? "You" : `${userName}`;
    li.append(img, spanTime, spanName);
    ul.appendChild(li);
  } else {
    const li = document.createElement("li");
    li.className =
      "relative text-md md:text-2xl max-md:w-[75%] md:max-w-[50%] md:min-w-[25%] p-2 wrap-anywhere outline-gray-500/50 outline rounded-md";

    if (senderId === currentUserId) {
      li.classList.add("self-end", "bg-gray-500/40");
    } else {
      li.classList.add("self-start", "bg-gray-800/80");
    }

    li.innerText = chat;

    const spanTime = document.createElement("span");
    spanTime.className = "absolute right-0 -top-6 text-sm opacity-80";
    spanTime.innerText = date.toLocaleString();

    const spanName = document.createElement("span");
    spanName.className = "absolute left-0 -top-7 text-lg";
    spanName.innerText = senderId === currentUserId ? "You" : `${userName}`;

    li.append(spanTime, spanName);
    ul.appendChild(li);
  }
}



// Ai chat suggestion

let timeout;

const inputMessage = document.querySelector('input[name="chat"]');
const suggestionDiv = document.getElementById("suggestion-div");

inputMessage.addEventListener("input", () => {
  clearTimeout(timeout);

  const text = inputMessage.value.trim();

  if (text.length <= 5) {
    suggestionDiv.classList.add("hidden");
    return;
  }

  timeout = setTimeout(async () => {
    try {
      const res = await axios.post("/ai/suggest", {
        partialText: text,
      });

      const suggestion = res.data.suggestion;

      if (!suggestion) {
        suggestionDiv.classList.add("hidden");
        return;
      }

      displaySuggestion(suggestion);

    } catch (err) {
      console.error("AI Error:", err);
      suggestionDiv.classList.add("hidden");
    }
  }, 500);
});

function displaySuggestion(suggestion) {
  suggestionDiv.innerText = suggestion;
  suggestionDiv.classList.remove("hidden");

  suggestionDiv.onclick = () => {
    inputMessage.value += " " + suggestion;
    suggestionDiv.classList.add("hidden");
    inputMessage.focus();
  };
}

