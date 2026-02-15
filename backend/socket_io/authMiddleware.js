const jwt = require("jsonwebtoken");
module.exports =(io)=>{
    // socket auth
    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
      } catch (error) {
        console.log("Auth error:", error.message);
        next(new Error("Authentication failed")); // reject connection
      }
    });
}