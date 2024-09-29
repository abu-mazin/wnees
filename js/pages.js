myApp.onPageInit('send_message', function (page) {
  $$('.submit-message').on('click', function (e) {
    e.preventDefault();

    var submitMessage = myApp.formToJSON('#sendMessageForm');
    // submitMessage.available_message_id = 2;
    submitMessage.is_random = 1;
    console.log(submitMessage)

    $$.doAJAX(`messages`, submitMessage, 'POST', true,
      // Success (200)
      function (r, textStatus, xhr) {
        console.log(r)

      },
      // Failed
      function (xhr, textStatus) {
        // Failed notification
          failedNotification4AjaxRequest(xhr, textStatus);
      });
  });
});

myApp.onPageInit('received_messages', function (page) {
  $$.doAJAX(`messages/user-received-messages`, {}, 'GET', true,
    // Success (200)
    function (r, textStatus, xhr) {

      if(r.length === 0) {
        $$('.received-messages').append(
          `
            <img src="img/no-recieved-message.png" alt="" />
            <div style="font-size: 22px">لا يوجد رسائل مستلمة بعد</div>
          `
        )
      }
        
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
        failedNotification4AjaxRequest(xhr, textStatus);
    });
});