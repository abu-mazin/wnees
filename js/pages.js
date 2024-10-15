myApp.onPageInit('received_messages', function (page) {
  $$.doAJAX('messages/user-received-messages', {}, 'GET', true,
    // Success (200)
    function (r, textStatus, xhr) {
      // Retrieve or initialize openedMessages from localStorage
      let openedMessages = JSON.parse(getThis('openedMessages')) || {};
  
      if (r.length === 0) {
        $$('.received-messages').append(
          `
            <div class="no-messages">
              <img src="img/no-recieved-message.png" alt="" />
              <div style="font-size: 22px">لا يوجد رسائل مستلمة بعد</div>
            </div>
          `
        );
      } else {
        r.forEach(msg => {
          // Check if the message ID exists in openedMessages; if not, it's unread
          const isOpened = openedMessages[msg.id] === 1;
          const messageClass = isOpened ? '' : 'unread';
  
          // Append the message with appropriate class (unread if not opened)
          $$('.received-messages').append(
            `
            <div class="received-message ${messageClass}" data-key=${msg.id}>
              <div class="replies-num"><img alt="" src="img/icons/reply.svg" /> <span>${msg.responses.length}</span></div>
              <span class="message-content">${msg.message}</span>
              <span class="message-sender">من 
                <img src=${msg.sender.profile_picture ? imagePath + msg.sender.profile_picture : "img/user-pic.svg"} alt="" class="sender-image"/> 
                ${msg.sender.name}
              </span>
            </div>
            `
          );
  
          // After appending, add this message ID to openedMessages if not already present
          if (!openedMessages[msg.id]) {
            openedMessages[msg.id] = 1; // Mark as opened by setting value to 1
          }
        });
  
        // Update localStorage with the new openedMessages object
        setThis('openedMessages', JSON.stringify(openedMessages));
      }
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
    }
  );
  
});