#Exam questions period 5

###1: Name attributes of HTTP protocol makes it difficult to use for real time systems.
The HTTP protocol has some limitations which makes it difficult to use for real time systems. First of all whenever you make a request, say to download html, or an image, a port/socket is opened, data is transferred, and then it is closed.

The opening and closing creates overhead, and for certain applications, especially for real time systems which require real time interactions this just doesn’t work.

Another limitation with HTTP is that it is a “pull” paradigm. The browser will request or pull information from servers, but the server cann't push data to the browser when it wants to. This means that browsers will have to poll the server for new information by repeating requests every "so many seconds or minutes" to see if there is anything new.

###2: Explain polling and long-polling strategies, their pros and cons

#####Traditional Polling:
With polling, an AJAX application will poll the server for data every time the content of the page require an update. As an example, a chat based application will poll the server every 10 seconds to see if new chat messages are available. Technically, it means the browser will open a connection to the server every time data are required.

There is several problems with this approach. The first one is scalability. The number of requests made to the server can be extremely high if the frequency of polling is set to a small value. As an example, if you expect your applications to be deployed on a small server but still support 10 000 simultaneous users, the performance of your application might be extremely bad. Not only the server but also the network can become saturated with all those requests. Another problem could be if there is no data on the server, the response will not contains any data. Doing such “void” request overload the server for nothing.

######Example:
	// The setInterval Technique (Not Recommended - Creates Queues of Requests ∴ Can Be Slow)
	setInterval(function(){
	  $.ajax({ url: "server", success: function(data){
	      //Update your dashboard gauge
	      salesGauge.setValue(data.value);
	  }, dataType: "json"});
	}, 30000);

#####Long Polling:
HTTP Long-polling is a technique used to push updates to a web client. A connection is held open between the web client and the web server so that when the server has new information it can push it to the client. That connection is then closed. A new connection is then established between the client and the server and then wait for another update from the server. So in other words with long polling, the client requests information from the server in a way similar to a normal polling; however, if the server does not have any information available for the client, then instead of sending an empty response, the server holds the request and waits for information to become available (or for a suitable timeout event), after which a complete response is finally sent to the client.

Long polling reduces the amount of data that needs to be sent because the server only sends data when there really "is" data, hence the client does not need to check at every interval x. Keeping the connection to the server open eliminates the travel time from client to server and thus, significantly reduces the issues surrounding network latency.

But the advantages of long polling depends on which server you are using. If your server support asynchronous request processing, then you are possibly in a good shape. If not, then long polling might give extremely bad results. Why? Because most probably on the server side the request will block using a thread until new data comes. So if 10 000 AJAX applications open one long polled connection, that means 10 000 threads will blocks waiting for data to come. All servers that use blocking IO technologies will suffer that problem. It can be doable, but you will need to make sure your entire stack (server, os, etc.) can support 10 000 threads (which consume a lot of memory)

######Example:
	// Long Polling (Recommened Technique - Creates An Open Connection To Server ∴ Fast)
	(function poll(){
	  $.ajax({ url: "server", success: function(data){
	    //Update your dashboard gauge
	    salesGauge.setValue(data.value);
	  }, dataType: "json", complete: poll, timeout: 30000 });
	})();

Source:
[Polling, Long Polling or Http streaming with AJAX.](https://jfarcand.wordpress.com/2007/05/15/new-adventures-in-comet-polling-long-polling-or-http-streaming-with-ajax-which-one-to-choose/)
[Simple Long Polling Example with JavaScript and jQuery.](http://techoctave.com/c7/posts/60-simple-long-polling-example-with-javascript-and-jquery)
###3: What is HTTP streaming, SSE (Server sent events)?
Server-sent events is a standard describing how servers can initiate data transmission towards clients once an initial client connection has been established. They are commonly used to send message updates or continuous data streams to a browser client and designed to enhance native, cross-browser streaming through a JavaScript API called EventSource, through which a client requests a particular URL in order to receive an event stream.

Http streaming is similar to the long polling technique except the connection is never closed, even after the server push data. With streaming the application will only send a single request and receive chunked(partial) responses as they come, re-using the same connection forever. This technique significantly reduce the network latency as the browsers and server don’t need to open/close the connection. Http streaming suffer the same problem as long polling: if the server push data too often, it might severely impact performance of the network and the applications. Why? If your application gets too many updates, it might not be able to render the page as fast as the updates arrive, hence producing a potential lost of data on the client side. The server might also have trouble updating 10 000 clients every second.

Source:
[SSE](https://en.wikipedia.org/wiki/Server-sent_events)
[Polling, Long Polling or Http streaming with AJAX.](https://jfarcand.wordpress.com/2007/05/15/new-adventures-in-comet-polling-long-polling-or-http-streaming-with-ajax-which-one-to-choose/)

###4: What is WebSocket protocol, how is it different from HTTP communication, what advantages it has over HTTP?
WebSockets are really just an extension of the socket idea. While HTTP was invented for the World Wide Web, and has been used by browsers since then, it had limitations. It was a particular protocol that worked in a particular way, and wasn’t well suited for every need. In particular was how HTTP handled connections. Whenever you made a request, say to download html, or an image, a port/socket was opened, data was transferred, and then it was closed.

The opening and closing creates overhead, and for certain applications, especially those that want rapid responses or real time interactions or display streams of data, this just doesn’t work.

The other limitation with HTTP was that it was a “pull” paradigm. The browser would request or pull information from servers, but the server couldn’t push data to the browser when it wanted to. This means that browsers would have to poll the server for new information by repeating requests every so many seconds or minutes to see if there was anything new. In the late 2000’s, a movement to add Sockets to browsers was mounting.

In 2011, the WebSocket was standardized, and this allowed people to use the WebSocket protocol, which was very flexible, for transferring data to and from servers from the browser, as well as Peer-to-Peer (P2P), or direct communication between browsers. Unlike HTTP, the socket that is connected to the server stays “open” for communication. That means data can be “pushed” to the browser in realtime on demand.

Source:
[What is Websockets](https://www.pubnub.com/blog/2015-01-05-websockets-vs-rest-api-understanding-the-difference/)

###5: Explain what the WebSocket Protocol brings to the Web-world.
The WebSocket specification defines an API establishing "socket" connections between a web browser and a server. In plain words: There is an persistent connection between the client and the server and both parties can start sending data at any time. Use WebSocket whenever you need a truly low latency, near realtime connection between the client and the server. Keep in mind that this might involve rethinking how you build your server side applications with a new focus on technologies such as event queues. Some example use cases are:

Multiplayer online games
Chat applications
Live sports ticker
Realtime updating social streams

Source:
[Introducing WebSockets](http://www.html5rocks.com/en/tutorials/websockets/basics/)

###6: Explain and demonstrate the process of WebSocket communication - From connecting client to server, through sending messages, to closing connection.
WebSockets provide a persistent connection between a client and server that both parties can use to start sending data at any time.

The client establishes a WebSocket connection through a process known as the WebSocket handshake. This process starts with the client sending a regular HTTP request to the server. An Upgrade header is included in this request that informs the server that the client wishes to establish a WebSocket connection.

Here is a simplified example of the initial request headers.

	GET ws://websocket.example.com/ HTTP/1.1
	Origin: http://example.com
	Connection: Upgrade
	Host: websocket.example.com
	Upgrade: websocket

Note: WebSocket URLs use the ws scheme. There is also wss for secure WebSocket connections which is the equivalent of HTTPS.

If the server supports the WebSocket protocol, it agrees to the upgrade and communicates this through an Upgrade header in the response.

	HTTP/1.1 101 WebSocket Protocol Handshake
	Date: Wed, 16 Oct 2013 10:07:34 GMT
	Connection: Upgrade
	Upgrade: WebSocket

Now that the handshake is complete the initial HTTP connection is replaced by a WebSocket connection that uses the same underlying TCP/IP connection. At this point either party can starting sending data.

Creating WebSocket connections is really simple. All you have to do is call the WebSocket constructor and pass in the URL of your server.

	// Create a new WebSocket.
	var socket = new WebSocket('ws://echo.websocket.org');

Once the connection has been established the "open" event will be fired on your WebSocket instance.

To send a message through the WebSocket connection you call the send() method on your WebSocket instance; passing in the data you want to transfer.

	socket.send(data);

When a message is received the message event is fired. This event includes a property called data that can be used to access the contents of the message.

	// Handle messages sent by the server.
	socket.onmessage = function(event) {
	  var message = event.data;
	  messagesList.innerHTML += '<li class="received"><span>Received:</span>' + message + '</li>';
	};

Once you’re done with your WebSocket you can terminate the connection using the close() method.

	socket.close();

After the connection has been closed the browser will fire a close event. Attaching an event listener to the close event allows you to perform any clean up that you might need to do.

###7: What's the advantage of using libraries like Socket.IO, Sock.JS, WS, over pure WebSocket libraries in the backend and standard APIs on frontend? Which problems do they solve?
The advantage of using libraries like Socket.IO, Sock.JS and WS is that it simplifies the usage of WebSockets. Without these librabries are you forced to keep an array of all connections and loop through it to send messages to all clients. The libraries will also provide failovers to other protocols in the event that WebSockets are not supported on the browser or server. Socket.IO supports autoreconnection, so you don't have to worry about temporary network failures, and finally there are rooms and namespaces support, which makes writing real-time applications much easier and enjoyable.

###8: What is Backend as a Service, Database as a Service, why would you consider using Firebase in your projects?
Backend as a Service, or BaaS (sometimes referred to as mBaaS) is best described by a tech analyst who refers to it as “turn-on infrastructure” for mobile and web apps. Basically, it’s a cloud computing category that’s comprised of companies that make it easier for developers to setup, use and operate a cloud backend for their mobile, tablet and web apps.

Database as a Service (DBaaS) is a cloud-based approach to the storage and management of structured data.
DBaaS delivers database functionality similar to what is found in relational database management systems (RDBMSes) such as SQL Server, MySQL and Oracle. Being cloud-based, on the other hand, DBaaS provides a flexible, scalable, on-demand platform that's oriented toward self-service and easy management, particularly in terms of provisioning a business' own environment. DBaaS products typically provide enough monitoring capabilities to track performance and usage and to alert users to potential issues. The products can also generate at least some degree of data analytics.

Since Firebase isn’t just any ordinary database, it is a real-time, scalable backend, which provide the tools you need to quickly build rich, collaborative applications that can serve millions of users, only developing client code. Firebase even provides the possibility for authentication. The reasons above describes why i think you should consider using Firebase in your projects.

###8: Explain the pros & cons of using a Backend as a Service Provider like Firebase.

#####pros:
- Scalable
- Flexible
- Easy to use
- Possibility for authentication
- Possibility for hosting

#####cons:
- Lack of control over network performance issues, such as unacceptable latency and application failures.
- You have to pay for the service.

###9: Explain and demonstrate “three-way data binding” using Firebase and Angular

First of all you will have to require Firebase and inject this into your angular module like this:

	require('firebase');
	require('angularfire');

	var ref = new Firebase("https://meanchat.firebaseio.com/");

	angular.module('chat', ['firebase'])

The varibale ref holds the reference to the Firebase backend and thereby makes the connection.

One of the fantastic things about Firebase is the three-way data binding and the example below shows how to set up this binding.

	var messagesRef = ref.child('messages');

    scope.messages = $firebaseArray(messagesRef);

The $firebaseArray service takes a Firebase reference or Firebase Query and returns a JavaScript array which contains the data at the provided Firebase reference. This service automatically keeps this local array in sync with any changes made to the remote database. While using read attributes and methods like length and toString() will work great on this array, you should avoid directly manipulating the array. Methods like splice(), push(), pop(), shift(), unshift(), and reverse() will cause the local data to become out of sync with the server. Instead, utilize the $add(), $remove(), and $save() methods provided by the service to change the structure of the array. To get the id of an item in a $firebaseArray within ng-repeat, call $id on that item.

To send a message you will use the $add, which is a function from the $firebaseArray, like the example below:

	scope.sendMessage = function() {
	      scope.messages.$add({
	        body: scope.messageInput
	      });
	      scope.messageInput = '';
	    };

The $add creates a new record in the database and adds the record to our local synchronized array. This method returns a promise which is resolved after data has been saved to the server. The promise resolves to the Firebase reference for the newly added record, providing easy access to its key.

###10: Explain and demonstrate the difference between the simple chat system in your own WebSocket + Node.js backend vs. Firebase.

In my simple chat system i use this service to establish the connection and wrap the socket object returned by Socket.IO:

	app.factory('socket', function ($rootScope) {
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
	      })
	    }
	  };
	});


Although Socket.IO exposes an io variable on the window, it's better to encapsulate it in AngularJS's Dependency Injection system. Notice that I wrap each socket callback in $scope.$apply. This tells AngularJS that it needs to check the state of the application and update the templates if there was a change after running the callback passed to it. Internally, $http works in the same way; after some XHR returns, it calls $scope.$apply, so that AngularJS can update its views accordingly.

Now, within my controller, I can ask for the socket object, much like $http:

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
	    })
  	});

On the server side I require the Socket.IO library and add it to my express app and then listen for a connection like this:

	app.io = require('socket.io')();

	app.io.on('connection', require('./routes/socket'));

When there is established a connection between the client and the server, I use this function to listen to the socket:

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

In contrast to the Firebase solution where you only need some few lines to accomplish almost the same functionality:

	var ref = new Firebase("https://meanchat.firebaseio.com/");

	var messagesRef = ref.child('messages');

    scope.messages = $firebaseArray(messagesRef);

    console.log(scope.messages);

    scope.sendMessage = function() {
      scope.messages.$add({
        body: scope.messageInput
      });
      scope.messageInput = '';
    };


