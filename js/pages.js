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