const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require("./routes/cart");

const {connectDB} = require('./config/database');

const app= express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    }
  });
  app.set("io", io);

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);
  
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
    });
  });

// middleware
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
app.use(express.json());

//routes
app.use('/api/auth',authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT= 3003;

connectDB().then(()=>{
    console.log('coonect to db');
    // app.listen(PORT, ()=> console.log(`Backend server running on port ${PORT}`));
    server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch((err)=>{
    console.log('Database is not connected: ', err);
})


