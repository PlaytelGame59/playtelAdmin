const chatRooms = {};

function initializeSocketIO(io) {
  io.on("connection", (socket) => {
    console.log("Socket established");

    socket.on("create_room", (data) => {
      const { room_code, user_id, price, join_fee, player_count } = data;

      if (chatRooms[room_code]) {
        socket.emit("create_room_failed", {
          room_code: room_code,
          message: "Failed to create room. Room already exists.",
        });
        return;
      }

      if (!room_code || room_code.trim() === '') {
        socket.emit("create_room_failed", {
          room_code: room_code,
          message: "Failed to create room. Room code is required.",
        });
        return;
      }

      socket.emit("created_room", {
        room_code: room_code,
        master_user_id: user_id, // Assuming the user creating is the master user
        message: `Room ${room_code} created successfully!`,
      });

      chatRooms[room_code] = {
        master_user_id: user_id,
        users: [user_id],
        // Other room-specific data as needed
      };
    });

    socket.on("join_room", (data) => {
      const { room_code, user_id, price, join_fee, player_count } = data;

      if(!chatRooms[room_code]) {
        socket.emit("join_room_failed", {
          room_code: room_code,
          message: "Failed to join room. Room does not exist.",
        });
        return;
      }

      // Any specific checks before joining (e.g., room capacity, user authorization, etc.)

      chatRooms[room_code].users.push(user_id);

      socket.emit("join_room_success", {
        room_code: room_code,
        user_id: user_id,
        message: `Joined room ${room_code} successfully!`,
      });

    });

    // socket.on("join_random_room", (data) => {
    //   const { user_id, price, join_fee} = data
    //   socket.emit("join_random_room_failed", {
    //     room_code: room_code,
    //     message: "Failed to join random room"
    //   })
     
    //   socket.emit("join_random_room_success", {
    //     room_code: room_code,
    //     user_id: user_id,
    //     message: `Joined room ${room_code} successfully!`,
    //   });
    // })

    socket.on('on_other_player_join_room', (data) => {
      const { user_id, room_code } = data;
  
      if(!chatRooms[room_code]) {
        socket.emit("on_other_player_join_room_failed", {
          room_code: room_code,
          message: "Failed to join room. Room does not exist.",
        });
        return;
      }
  
      chatRooms[room_code].users.push(user_id);
  
      // Emit events for different actions related to player joining
      socket.emit("on_other_player_join_room_success", {
        room_code: room_code,
        user_id: user_id,
        message: `Joined room ${room_code} successfully!`,
      });
  
      // Emit events for other player actions
      socket.broadcast.to(room_code).emit("on_other_player_left_room", {
        user_id: user_id,
        message: `Player ${user_id} left room ${room_code}.`,
      });
  
      socket.broadcast.to(room_code).emit("on_other_player_paused_game", {
        user_id: user_id,
        message: `Player ${user_id} paused the game in room ${room_code}.`,
      });
  
      socket.broadcast.to(room_code).emit("on_other_player_resume_game", {
        user_id: user_id,
        message: `Player ${user_id} resumed the game in room ${room_code}.`,
      });
    });
  

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = {
  initializeSocketIO,
};
