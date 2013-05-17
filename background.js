function launch() {
  chrome.app.window.create('index.html', {
    id: 'main',
    bounds: { width: 620, height: 500 }
  });
}

var dbName = 'todos-vanillajs';

function showNotification(storedData) {
  var openTodos = 0;

  if ( storedData[dbName].todos ) {
    storedData[dbName].todos.forEach(function(todo) {
      if ( !todo.completed ) {
        openTodos++;
      }
    });
  }

  if (openTodos > 0) {
    // Create the notification
    chrome.notifications.create('reminder', {
      type: 'basic',
      iconUrl: 'icon_128.png',
      title: 'Don\'t forget!',
      message: 'You have ' + openTodos +
               ' things to do.  Wake up, dude!'
    }, function(notificationId) {});
  }
}

// When the user clicks on the notification, we will open to ToDo list and dismiss
// the notification.
chrome.notifications.onClicked.addListener(
  function( notificationId ){
    launch();
    chrome.notifications.clear(notificationId, function() {});
  }
);

chrome.alarms.onAlarm.addListener(function( alarm ) {
  chrome.storage.local.get(dbName, showNotification);
});

chrome.app.runtime.onLaunched.addListener(launch);
