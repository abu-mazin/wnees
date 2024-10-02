myApp.onPageInit('received_messages', function (page) {
  $$.doAJAX(`messages/user-received-messages`, {}, 'GET', true,
    // Success (200)
    function (r, textStatus, xhr) {

      if(r.length === 0) {
        $$('.received-messages').append(
          `
            <div class="no-messages">
              <img src="img/no-recieved-message.png" alt="" />
              <div style="font-size: 22px">لا يوجد رسائل مستلمة بعد</div>
            </div>
          `
        )
      } else {
        r.forEach(msg=> {
          $$('.received-messages').append(
            `
            <div class="received-message">
              <span class="message-content">${msg.message}</span>
              <span class="message-sender">من ${msg.sender.name}</span>
            </div>
            `
          )
        })
      }
        
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
        failedNotification4AjaxRequest(xhr, textStatus);
    });
});