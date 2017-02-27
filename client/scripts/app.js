// YOUR CODE HERE:
window.roomNames = {};
window.filteredRoom = 'All Rooms';
window.friendList = {};

var app = {
  init: function() {
    $('.username').on('click', app.handleUsernameClick);
    // $('#send').on('click', app.handleSubmit);
    $('#send .submit').on('click', app.handleSubmit);
    // console.log('initialized');
  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: 'order=-createdAt',
      // data: JSON.stringify(message),
      // contentType: 'application/json',
      //dataType: 'jsonp',
      success: function (data) {
        console.log('chatterbox: Message received');
        //console.log(data);
        // debugger;
        for (var i = 0; i < data.results.length; i++) {
          //debugger;
          //render message only filtered rooms
          //if unfiltered, render all
          if ((data.results[i].roomname === window.filteredRoom) || window.filteredRoom === 'All Rooms') {
            app.renderMessage(data.results[i]);
          }

          // check if any duplications in room names;
          // if no duplications, they are added to the room dropdown list
          if (!window.roomNames[data.results[i].roomname || 'lobby']) {
            window.roomNames[data.results[i].roomname] = true;
            app.renderRoom(data.results[i].roomname);
          }

        }
        $('select').on('change', function() {
          debugger;
          window.filteredRoom = this.value;
          console.log('Room changed to ' + this.value);
          app.clearMessages();
          app.fetch();
        });
        $('.username').on('click', function() {
          debugger;
          window.friendList[this.innerHTML] = true; // see if any issues
          //this.className = 'username friend';
          console.log(this.innerHTML + ' is added to friend list');
          app.clearMessages();
          app.fetch();
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      },
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  renderMessage: function(message) {
    var container = document.createElement('div');
    container.className = 'container'; // <div class="container"></div>

    var username = document.createElement('div');
    if (window.friendList[message.username]) {
      username.className = 'username friend';
    } else {
      username.className = 'username';
    }
    username.append(message.username);
    var text = document.createElement('div');
    text.className = 'text';
    text.append(message.text);

    container.append(username);
    container.append(text);
    $('#chats').append(container);

  },
  renderRoom: function(room) {
    // var roomName = message.
    $('#roomSelect').append($('<option>', {
      value: room,
      text: room,
      onchange: function() {
      }
    }));
  },
  handleUsernameClick: function() {
  },
  handleSubmit: function(event) {
    // e.preventDefault();
    // debugger;
    var text = ($('#message')[0].value);
    var username = window.location.search.slice(10);
    var roomname = 'lobby';
    //var roomname = || 'lobby';
    var messageObject = {};
    messageObject['text'] = text;
    messageObject['username'] = username;
    messageObject['roomname'] = roomname;

    app.send(messageObject);
  },
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};


app.init();
app.fetch();

window.setInterval(function() {
  app.clearMessages();
  app.fetch();
}, 5000);


