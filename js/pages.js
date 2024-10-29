myApp.onPageInit('inbox', function (page) {
  $$.doAJAX('messages/user-received-messages', {}, 'GET', true,
    // Success (200)
    function (r, textStatus, xhr) {
      $$('[data-elm="inbox-num"]').hide();
      $$('[data-elm="inbox-num"]').text('');

      let openedMessages = JSON.parse(getThis('openedMessages')) || {};

      if (r.length === 0) {
        $$('.inbox').append(
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
          $$('.inbox').append(
            `
          <a href="#" class="received-message open-picker ${messageClass}" data-picker=".picker-respond-to-message" data-key=${msg.id}>
            <!-- <div class="replies-num"><img alt="" src="img/icons/reply.svg" /> <span>${msg.responses.length}</span></div> -->
            <span class="message-content">${msg.message}</span>
            <span class="message-sender">من 
              <img src=${msg.sender.profile_picture ? imagePath + msg.sender.profile_picture : "img/user-pic.svg"} alt="" class="sender-image"/> 
              ${msg.sender.name}
            </span>
          </a>
          `
          );

          // After appending, add this message ID to openedMessages if not already present
          if (!openedMessages[msg.id]) {
            openedMessages[msg.id] = 1; // Mark as opened by setting value to 1
          }
        });
        // Update localStorage with the new openedMessages object
        setThis('openedMessages', JSON.stringify(openedMessages));


        let key;
        $$('.received-message').off('click').on('click', function () {
          key = $$(this).attr('data-key');
          let messageObj = r.find(message => message.id == key);
          $$('[data-elm="sender-name"]').text(messageObj.sender.name)
          $$('[data-elm="message-content"]').text(messageObj.message)
          $$('[data-elm="sender-image"]').attr('src', messageObj.sender.profile_picture ? imagePath + messageObj.sender.profile_picture : "img/user-pic.svg")
        })

        $$('[data-elm="reply"]').off('click').on('click', function () {
          let id = $$(this).attr('id');
          let reply = { message_id: key, available_response_id: id, is_anonymous: 1 }

          $$.doAJAX('messages/respond-to-message', reply , 'POST', true,
            // Success (200) - when random message is successfully retrieved
            function (r, textStatus, xhr) {
              myApp.toast('تم الرد', '✓', { duration: 2000 }).show();
            });
        })
      }
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
    });
});