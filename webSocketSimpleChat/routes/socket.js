var users = [];

// export function for listening to the socket
module.exports = function (socket) {

  function broadcast(type, payload) {
    socket.emit(type, payload);
    socket.broadcast.emit(type, payload);
  }

  socket.on('send:message', function (data) {
    broadcast('receive:message', {
      data: data
    });
  });

  socket.on('add user', function (username) {
      socket.username = username;
      users.push(socket.username);
      broadcast('users', users);
  });
};
