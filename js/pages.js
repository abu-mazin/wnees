myApp.onPageInit('send_message', function (page) {
  $$('.submit-message').on('click', function (e) {
    e.preventDefault();

    var submitMessage = myApp.formToJSON('#sendMessageForm');
    console.log(submitMessage)

    // $$.doAJAX('messages', {}, 'POST', true,
    //   // Success (200)
    //   function (r, textStatus, xhr) {
    //     console.log(r)

    //   },
    //   // Failed
    //   function (xhr, textStatus) {
    //     // Failed notification
    //       failedNotification4AjaxRequest(xhr, textStatus);
    //   });
  });
});