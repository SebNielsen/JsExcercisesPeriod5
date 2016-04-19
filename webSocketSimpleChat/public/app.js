angular.module('chat', [])

  .factory('socket', function ($rootScope) {
    // See: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
    // for further details about this wrapper
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  })

  .controller('mainController', function(socket){
    var scope = this;

    scope.messages = [];
    scope.users = [];
    
    scope.isAuthenticated = false;
    
    scope.login = function() {
      socket.emit('add user', scope.userName);
      scope.userName = '';
      scope.isAuthenticated = true;
    };

    scope.sendMessage = function() {
      socket.emit('send:message', scope.messageInput);
      scope.messageInput = '';
    };

    socket.on('receive:message', function(message){
      scope.messages.push({
        body: message.data
      });
    });

    socket.on('users', function(users){
      scope.users = [];
      users.forEach(function(user){
        scope.users.push(user);
      });
    });
    
    
  });