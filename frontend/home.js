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
  // await loadAllMessages();
  const chatBox = document.getElementById("chatBox");
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
  // create socket connection
  socket = io({
    auth: { token },
  });
  socket.on("connect", () => {
    console.log("Connected to Socket server");
    console.log("Socket ID:", socket.id);
  });
  socket.on("message", (data) => {
    const chat = data.chat;
    const senderId = data.userId.id;
    const createdAt = data.createdAt;
    const userName = data.userName;
    if (senderId===currentReceiverId) {
      newMessage(chat, senderId, createdAt, userName);
    }
  });

  socket.on("privateMessage", (data) => {
    const chat = data.chat;
    const senderId = data.userId;
    const createdAt = data.createdAt;
    const userName = data.userName;
    const receiverId = data.receiverId
    if (  (senderId === currentReceiverId && receiverId === currentUserId) ||
  (senderId === currentUserId && receiverId === currentReceiverId)) {
      currentRoomMessages(chat, senderId, createdAt, userName);
    }
  });
  displayAllUsers();
};

async function displayAllUsers() {
  const section = document.getElementById("users-section");
  const response = await axios.get("/user/allUsers", {
    headers: { Authorization: token },
  });

  const users = response.data.users;
  currentUserId= response.data.userId
  users.forEach((user) => {
    const h2 = document.createElement("h2");
    if(user.id===currentUserId){}
    h2.innerText = user.id === currentUserId?`${user.name} (You)`:user.name
    // h2.innerText = user.name;
    section.appendChild(h2);
    h2.onclick = () => {
      currentReceiverId = user.id;
      if (activeUserElement) {
        activeUserElement.classList.remove('invert')
      }
      h2.classList.add('invert')
      activeUserElement=h2
      displayPersonalMessages(currentUserId,currentReceiverId);
      
    };
  });
}

async function displayPersonalMessages(currentUserId, currentReceiverId) {
  try {
    const response = await axios.get(
      "/message/personalMessages",{
        params:{
          senderId:currentUserId,
          receiverId:currentReceiverId
        },
        headers: { Authorization: token },
      },
    );
    const messages = response.data.messages;
    currentUserId = response.data.userId;
    const ul = document.getElementById("chatBox");
    ul.innerHTML = "";
    messages.forEach((message) => {
      const date = new Date(message.createdAt);

      const li = document.createElement("li");
      li.className = `relative text-md md:text-2xl max-md:w-[75%] md:max-w-[50%] md:min-w-[25%] p-2 wrap-anywhere outline-gray-500/50 outline rounded-md`;
      if (message.userId === currentUserId) {
        li.classList.add("self-end", "bg-gray-500/40");
      } else {
        li.classList.add("self-start", "bg-gray-800/80");
      }
      li.innerText = `${message.chat}`;
      const spanTime = document.createElement("span");
      spanTime.className = "absolute right-0 -top-6 text-sm opacity-80";
      spanTime.innerText = `${date.toLocaleString()}`;
      const spanName = document.createElement("span");
      spanName.className = "absolute left-0 -top-7 text-lg";
      spanName.innerText =
        message.userId === currentUserId ? "You" : `${message.sender.name}`;

      li.append(spanTime, spanName);
      ul.appendChild(li);
    });
    // displayMessages();
    const chatBox = document.getElementById("chatBox");
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
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
      socket.emit("privateMessage", { chat, receiverId:currentReceiverId });
      event.target.reset();
      return;
    }
    socket.emit("message", { chat });
    event.target.reset();
  } catch (error) {
    console.log(error.response?.data?.message || "Something went wrong");
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

function newMessage(chat, senderId, createdAt, userName) {
  const ul = document.getElementById("chatBox");
  const date = new Date(createdAt);
  const li = document.createElement("li");
  li.className =
    "relative text-2xl max-w-[50%] min-w-[20%] p-2 bg-gray-800/80 wrap-anywhere outline-gray-500/50 outline rounded-md";

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
  spanName.innerText = senderId === currentUserId ? "You" : `user ${userName}`;

  li.append(spanTime, spanName);
  ul.appendChild(li);
  ul.scrollTo({
    top: ul.scrollHeight,
    behavior: "smooth",
  });
}

async function loadAllMessages() {
  try {
    const response = await axios.get("/message/allMessages", {
      headers: { Authorization: token },
    });
    const messages = response.data.messages;
    currentUserId = response.data.userId;
    const ul = document.getElementById("chatBox");
    ul.innerHTML = "";
    messages.forEach((message) => {
      const date = new Date(message.createdAt);

      const li = document.createElement("li");
      li.className = `relative text-md md:text-2xl max-md:w-[75%] md:max-w-[50%] md:min-w-[25%] p-2 wrap-anywhere outline-gray-500/50 outline rounded-md`;
      if (message.userId === currentUserId) {
        li.classList.add("self-end", "bg-gray-500/40");
      } else {
        li.classList.add("self-start", "bg-gray-800/80");
      }
      li.innerText = `${message.chat}`;
      const spanTime = document.createElement("span");
      spanTime.className = "absolute right-0 -top-6 text-sm opacity-80";
      spanTime.innerText = `${date.toLocaleString()}`;
      const spanName = document.createElement("span");
      spanName.className = "absolute left-0 -top-7 text-lg";
      spanName.innerText =
        message.userId === currentUserId ? "You" : `${message.user.name}`;

      li.append(spanTime, spanName);
      ul.appendChild(li);
    });
    // displayMessages();
    const chatBox = document.getElementById("chatBox");
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: "smooth",
    });
  } catch (error) {
    console.log(error);
  }
}

function currentRoomMessages(chat, senderId, createdAt, userName) {
  const ul = document.getElementById("chatBox");
  const date = new Date(createdAt);
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
  ul.scrollTo({
    top: ul.scrollHeight,
    behavior: "smooth",
  });
}
