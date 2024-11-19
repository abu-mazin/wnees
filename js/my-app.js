// ======================================
// COMMON SCTIPTS
// SCTIPTS USED EVERYWHERE
// ======================================
// store data in localStorage/local DB
function setThis(name, value) {
  if (useDB) {
    DB_data['wnees_' + name] = value;
    db.executeSql('UPDATE DB_data SET json_result = ?', [JSON.stringify(DB_data)]);
  } else {
    window.localStorage.setItem('wnees_' + name, value);
  }
}

// get stored data from localStorage/local DB
function getThis(name) {
  if (useDB) {
    return DB_data['wnees_' + name];
  } else {
    return window.localStorage.getItem('wnees_' + name);
  }
}

// remove stored data from localStorage/local DB
function removeThis(name) {
  if (useDB) {
    delete DB_data['wnees_' + name];
    db.executeSql('UPDATE DB_data SET json_result = ?', [JSON.stringify(DB_data)]);
  } else {
    window.localStorage.removeItem('wnees_' + name);
  }
}

// convert numbers..
function convertIndianToArabic(indianNumber) {
  const indianNumerals = {
    '٠': 0,
    '١': 1,
    '٢': 2,
    '٣': 3,
    '٤': 4,
    '٥': 5,
    '٦': 6,
    '٧': 7,
    '٨': 8,
    '٩': 9
  };

  let arabicNumber = 0;

  for (let i = 0; i < indianNumber.length; i++) {
    const numeral = indianNumber[i];
    const value = indianNumerals[numeral];

    if (value === undefined) {
      throw new Error(`Invalid Indian numeral: ${numeral}`);
    }

    arabicNumber = (arabicNumber * 10) + value;
  }

  return arabicNumber;
}

// Picker overlay
$$('.picker-modal').on('picker:open', function () {
  $$('.picker-overlay').css({
    opacity: 1,
    pointerEvents: 'auto',
  });
});

$$('.picker-modal').on('picker:close', function () {
  $$('.picker-overlay').css({
    opacity: 0,
    pointerEvents: 'none',
  });
});

// Custom Ajax wrappers:
$$.doAJAX = function (path, data, type, hideIndicator, callback, errorCallback) {
  if (!hideIndicator)
    myApp.showIndicator();
  var headers = { 'accept': 'application/json' };
  if ((getThis("userLogedin") == 1 || getThis("randomUserLogedin") == 1) && typeof userGUID != "undefined") {
    headers = { 'accept': 'application/json', 'GUID': userGUID };
    if (path == "users/login")
      headers = { 'accept': 'application/json' };
  }
  $$.ajax({
    url: APIurl + path,
    data: data, // parameters
    type: type, // 'GET', 'POST', etc..
    crossDomain: true,
    dataType: 'json',
    headers: headers,
    success: callback,
    error: errorCallback,
  });
}

$$(document).on('ajaxComplete', function (e, xhr) {
  myApp.hideIndicator();
});

// handle failed ajax requests
function failedNotification4AjaxRequest(xhr, textStatus) {
  // HTTP error (can be checked by xhr.status and xhr.statusText)
  if (typeof xhr != 'undefined') {
    if (xhr.readyState == 4) {
      var responseText = JSON.parse(xhr.responseText);
      if (textStatus == 422) {
        var responseText = JSON.parse(xhr.responseText);
        if (typeof responseText != 'undefined' && responseText != null) {
          if (typeof responseText.errors != 'undefined' && responseText.errors != null) {
            for (var x in responseText.errors) {
              myApp.alert(responseText.errors[x]);
              break;
            }
          } else if (typeof responseText.message != 'undefined' && responseText.message != null) {
            myApp.alert(responseText.message);
          } else {
            myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'طلب غير مكتمل، حاول مجدداً' });
          }
        } else {
          myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'طلب غير مكتمل، حاول مجدداً' });
        }
      } else if (textStatus == 400) {
        myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'طلب غير صحيح، حاول مجدداً' });
      } else if (textStatus == 401) {
        myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'غير مصرح بهذه العملية' });
        initUserLogedout();
      } else if (textStatus == 403) {
        myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'لا تملك صلاحيات كافية لهذه العملية' });
      } else if (textStatus == 404) {
        myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'لم يتم العثور!' });
      } else if (textStatus == 500 || textStatus == 502 || textStatus == 503) {
        myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'فقد الاتصال! حاول مرة أخرة' });
      } else {
        try {
          var responseText = JSON.parse(xhr.responseText);
          if (typeof responseText != 'undefined' && responseText != null) {
            if (typeof responseText.errors != 'undefined' && responseText.errors != null) {
              for (var x in responseText.errors) {
                myApp.alert(responseText.errors[x]);
                break;
              }
            } else if (typeof responseText.message != 'undefined' && responseText.message != null) {
              myApp.alert(responseText.message);
            } else {
              myApp.addNotification({ hold: 3000, title: 'خطأ', message: 'حدث خطأ! حاول مرة أخرى.' });
            }
          } else {
            myApp.addNotification({ hold: 3000, title: 'خطأ', message: 'حدث خطأ! حاول مرة أخرى.' });
          }
        } catch (e) {
          console.log('The response might be not JSON type!');
          console.log('Check request response for mpre details!');
          console.log('افحص استجابة الطلب القادمة من الباك اند لمحاولة كشف المزيد عن هذا الخطأ');
          myApp.addNotification({ hold: 3000, title: 'خطأ', message: 'حدث خطأ! حاول مرة أخرى.' });
        }
      }
    }
    // Network error (i.e. connection refused, access denied due to CORS, etc.)
    else if (xhr.readyState == 0) {
      myApp.addNotification({ hold: 3000, title: 'خطأ', message: 'حدث خطأ! حاول مرة أخرى.' });
    }
    // something weird is happening
    else {
      myApp.addNotification({ hold: 3000, title: 'خطأ', message: 'حدث خطأ! حاول مرة أخرى.' });
    }
  } else {
    console.log('لا يفترض ان يظهر هذا الخطأ! ارجو ابلاغي في خال ظهر لمتابعة ومعالحة المشكلة....');
    myApp.addNotification({ hold: 3000, title: 'خطأ', message: 'حدث خطأ! حاول مرة أخرى.' });
  }
}

// ======================================
// WELCOME SCREEN
// ======================================
var welcomeSlider = myApp.swiper('.welcome-screen-swiper', {
  nextButton: '.welcome-screen-swiper .welcome-next-btn',
});

$$('.welcome-screen').on('popup:close', function () {
  setThis("hideWelcomeScreen", 1);
  if (getThis("userLogedin") != 1 && getThis("randomUserLogedin") != 1) requestName();
});


// ======================================
// REGISTER/LOGIN
// ======================================
$$('.signUpForm-to-json').on('click', function (e) {
  e.preventDefault();
  var SignUPForm_parms = myApp.formToJSON('#signUpForm');
  if(signUpForm_parms.terms != 1){
    myApp.alert('مطلوب الموافقة على شروط الاستخدام.'); 
    return false;
  }
  SignUPForm_parms.name = user.name;
  delete SignUPForm_parms.terms;
  $$.doAJAX('users/register', SignUPForm_parms, 'POST', false,
    // Success (200)
    function (r, textStatus, xhr) {
      initUserLoggedIn();

      // close popups
      myApp.closeModal('.popup-signup');
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      if (textStatus == 401)
        myApp.alert('البريد الإلكتروني غير صحيح.');
      else
        failedNotification4AjaxRequest(xhr, textStatus);
    });

  return false;
});

$$('.signInForm-to-json').on('click', function (e) {
  e.preventDefault();

  // get form parameters
  var SignInForm_parms = myApp.formToJSON('#signInForm');

  $$.doAJAX('users/login', SignInForm_parms, 'POST', false,
  // Success (200)
  function (r, textStatus, xhr) {
    setThis("userLogedin", 1);
    setThis('userData', JSON.stringify(r));

    initUserLoggedIn();

    // close popups
    myApp.closeModal('.popup-login')
  },
  // Failed
  function (xhr, textStatus) {
    // Failed notification
    if (textStatus == 401)
      myApp.alert('البريد الإلكتروني غير صحيح.');
    else if (textStatus == 422)
      myApp.addNotification({ hold: 3000, title: 'تنبيه', message: 'من فضلك أدخل بريد إلكتروني صحيح' });
    else
      failedNotification4AjaxRequest(xhr, textStatus);
  });

  return false;
});

$$('.logout').on('click', function () {
  initUserLogedout();
})

function initUserLoggedIn() {
  $$('[data-elm="create-random-user-container"]').hide();
  $$('.app-block').removeClass('disabled');
  $$('.app-block').show();

  $$('[data-elm="share-message"]').removeClass('disabled');
  $$('[data-elm="inbox-btn"]').removeClass('disabled');

  $$('img[data-elm="user-image"]').attr('data-popup', '.popup-settings').addClass('open-popup');
  $$('[data-elm="welcoming-message"]').attr('data-popup', '.popup-settings').addClass('open-popup');

  if (getThis("userLogedin")) {
    userLogedin = true;
    $$('.navbar-user-name').hide();
    $$('.logout').show();
    $$('.navbar-create-account-container').hide();
    $$('.navbar-create-account-container .navbar-create-account').hide();
    $$('.navbar-create-account-container .logout').hide();
    $$('[data-elm="delete-account"]').show();
  } else {
    $$('.navbar-user-name').hide();
    $$('.navbar-create-account-container').show();
    $$('.navbar-create-account-container .navbar-create-account').show();
    $$('.navbar-create-account-container .logout').show();
    $$('[data-elm="delete-account"]').hide();
  }

  user = new User(JSON.parse(getThis("userData")));
  userGUID = user.guid;
  $$('*[data-elm="user-name"]').text(user.name);
  $$('*[data-elm="user-name"]').val(user.name);
  $$('[data-elm="show-share-link"]').show();
  $$('[data-elm="share-link-container"]').hide();

  if (user.profilePicture) {
    $$('[data-elm="user-image"]').attr('src', imagePath + user.profilePicture);
    $$('[data-elm="step2"]').addClass('show');
    $$('[data-elm="step3"]').addClass('show');
    $$('[data-elm="go2step2"]').hide();
    $$('[data-elm="go2step3"]').hide();
    setThis('showStep2', 1);
    setThis('showStep3', 1);
  } else {
    $$('[data-elm="user-image"]').attr('src', 'img/user-pic.svg');
    if (getThis('showStep2') == 1) {
      $$('[data-elm="step2"]').addClass('show');
      $$('[data-elm="go2step2"]').hide();
    }
    if (getThis('showStep3') == 1) {
      $$('[data-elm="step3"]').addClass('show');
      $$('[data-elm="go2step3"]').hide();
    }
  }

  getRandomMessage();
  getSentMessages();
  getReceivedMessages();

  setTimeout(() => {
    if(isNotificationEnabled == true && typeof OneSignalIDs != 'undefined' && OneSignalIDs != null && OneSignalIDs != "") {
      // Your callback logic here
      $$.doAJAX('users-info', { play_id: OneSignalIDs, _method: 'PUT' }, 'POST', true,
      // Success (200)
      function (r, textStatus, xhr) {
      },
      // Failed
      function (xhr, textStatus) {
      });
    }
  }, "5000");
}
  
// is Guest (first time)? then request name
function requestName() {
  $$('[data-elm="create-random-user-container"]').show();
  $$('.app-block').addClass('disabled');
  $$('.app-block').hide();
}

// create random user 
$$('[data-elm="create-random-user"]').on('click', function (e) {
  e.preventDefault();

  if($$(".name-container [name=terms]").is(':checked') != true){
    myApp.alert('مطلوب الموافقة على شروط الاستخدام.'); 
    return false;
  }

  var userName = $$('[data-elm="guest-name"]').val().trim();
  if (userName.length >= 2) {
    // Your callback logic here
    $$.doAJAX('users-info', { name: userName }, 'POST', false,
      // Success (200)
      function (r, textStatus, xhr) {
        if (typeof r != 'undefined' && r != null) {
          setThis("randomUserLogedin", 1);
          setThis("userData", JSON.stringify(r));
          initUserLoggedIn();
          myApp.popup(".popup-signup");
        }
      },
      // Failed
      function (xhr, textStatus) {
        failedNotification4AjaxRequest(xhr, textStatus);
      });
  } else {
    myApp.alert('الاسم قصير جداً! حاول مجدداً');
  }
});

// logout
function initUserLogedout() {
  $$('[data-elm="create-random-user-container"]').show();
  $$('.app-block').addClass('disabled');
  $$('.app-block').hide();
  $$('[data-elm="inbox-btn"]').addClass('disabled');
  $$('[data-elm="inbox-num"]').hide();
  $$('[data-elm="new-message"]').hide();

  
  $$('[data-elm="show-share-link"]').show();
  $$('[data-elm="share-link-container"]').hide();
  $$('[data-elm="share-message"]').removeClass('disabled');
  $$('[data-elm="step2"]').removeClass('show');
  $$('[data-elm="step3"]').removeClass('show');
  $$('[data-elm="go2step2"]').show();
  $$('[data-elm="go2step3"]').hide();
  $$('[data-elm="messages-container"]').html('');

  $$('img[data-elm="user-image"]').removeAttr('data-popup').removeClass('open-popup');
  $$('[data-elm="welcoming-message"]').removeAttr('data-popup').removeClass('open-popup');


  //clear all data
  if (useDB) {
    DB_data = [];
    db.executeSql('UPDATE user_main_data SET json_result = ?', ['{}']);
  } else {
    localStorage.clear();
  }

  userLogedin = false;
  user = undefined;
  userGUID = undefined;
  $$('[data-elm="user-image"]').attr('src', 'img/user-pic.svg');
  $$('*[data-elm="user-name"]').empty();
  $$('*[data-elm="user-name"]').val('');

  $$('.navbar-user-name').show();
  $$('.navbar-create-account-container').hide();
  $$('.navbar-create-account-container .navbar-create-account').hide();
  $$('.logout').hide();
  $$('[data-elm="delete-account"]').hide();

  setThis("hideWelcomeScreen", 1);
  requestName();
}

if (getThis("userLogedin") == 1 || getThis("randomUserLogedin") == 1) initUserLoggedIn();
else requestName();


// ======================================
// USER
// ======================================
$$('#profile_picture').on('change', function (event) {
  var input = event.target;

  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $$('.user-image').attr('src', e.target.result).css('display', 'block');
    };
    reader.readAsDataURL(input.files[0]); // Convert the file to a base64 string for preview
  }
});

$$('.changeSettingsForm').on('click', function (e) {
  e.preventDefault();

  // Create a FormData object instead of using JSON
  var formData = new FormData($$('#change-settings')[0]); // Serialize form into FormData
  formData.append('_method', 'PUT'); // Add _method field to FormData

  // Get the file input element
  var fileInput = $$('#profile_picture')[0];

  // Check if a file is selected
  if (fileInput && fileInput.files.length > 0) {
    var profilePicture = fileInput.files[0];
    formData.append('profile_picture', profilePicture); // Append the file to FormData
  }

  // Proceed with AJAX request to send the FormData
  $$.doAJAX('users-info', formData, 'POST', true,
    // Success (200)
    function (r, textStatus, xhr) {
      $$('*[data-elm="user-name"]').text(r.name);
      $$('*[data-elm="user-name"]').val(r.name);
      if (r.profile_picture) {
        $$('[data-elm="user-image"]').attr('src', imagePath + r.profile_picture);
      }

      user.name = r.name;
      user.profilePicture = r.profile_picture;

      let data = JSON.parse(getThis("userData"));
      data.name = r.name;
      data.profile_picture = r.profile_picture;
      setThis("userData", JSON.stringify(data));

      myApp.closeModal('.popup-settings');
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
    });
});


// ======================================
// STEPS
// ======================================
// Show the first step when the start button is clicked
$$('[data-elm="go2step2"]').on('click', function () {
  var step2 = $$('[data-elm="step2"]');
  step2.addClass('show');
  step2[0].scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the element
  setThis('showStep2', 1);
  $$('[data-elm="go2step2"]').hide();
});

$$('[data-elm="go2step3"]').on('click', function () {
  var step3 = $$('[data-elm="step3"]');
  step3.addClass('show');
  step3[0].scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the element
  setThis('showStep3', 1);
  $$('[data-elm="go2step3"]').hide();
});


// ======================================
// MESSAGES AND RESPONCES
// ======================================
$$('.dice').on('click', function () {
  $$(this).addClass('shake-animation');
  getRandomMessage();
});

$$('.custom-message').on('click', function (e) {
  e.preventDefault();

  //var msg = myApp.formToJSON('#sendMessageForm').message.replace(/(?:\r\n|\r|\n)/g, '<br>');
  var msg = myApp.formToJSON('#sendMessageForm').message;
  if(msg.length > 2){
    msgParms = { message_id: -1, message: msg };
    //$$(".random-message").html(msg);
    $$(".random-message").html(msg.replace(/(?:\r\n|\r|\n)/g, '<br>'));
    myApp.closeModal(".picker-send-message");
  
    $$('[data-elm="show-share-link"]').show();
    $$('[data-elm="share-link-container"]').hide();
    $$('[data-elm="share-message"]').addClass('disabled');
  } else {
    myApp.alert('رسالتك قصيرة جداً! حاول مجدداً..');
  }
});

$$('.newMessageBtn').on('click', function (e) {
  e.preventDefault();

  $$('[data-elm="new-message"]').hide();

  $$('.dice').addClass('shake-animation');
  getRandomMessage();
});

$$('[data-elm="show-share-link"]').on('click', function () {
  var thisElm = $$(this);
  $$.doAJAX('public-messages', msgParms, 'POST', false,
    // Success (200) - when public message is successfully sent
    function (r, textStatus, xhr) {
      $$('[data-elm="message-share-link"]').text(r.sharing_url);
      thisElm.hide();
      $$('[data-elm="share-link-container"]').show();
      //var msg = msgParms.message.replace(/(?:<br>|<br\/>|<br \/>)/gm, "\n");
      //var msg = msgParms.message.replace(/(?:\r\n|\r|\n)/g, ' , ');
      var msg = 'عبر عن رأيك بصورة! ';
      $$('[data-elm="share-button"]').attr('onClick', "window.plugins.socialsharing.share('"+msg+"', null, null, '"+r.sharing_url+"')");
      $$('[data-elm="open-button"]').attr('onClick', "cordova.InAppBrowser.open('"+r.sharing_url+"', '_system');");
      $$('[data-elm="new-message"]').show();
      $$('[data-elm="new-message"]').css('display', 'flex');
    },
    // Failed to send public message
    function (xhr, textStatus) {
      failedNotification4AjaxRequest(xhr, textStatus);
    });
});

$$('[data-elm="share-message"]').on('click', function () {
  let message = {};
  message.is_random = 1;
  if(msgParms.message_id > -1) message.availabe_message_id = msgParms.message_id;
  message.message = msgParms.message;

  $$.doAJAX(`messages`, message, 'POST', false,
    // Success (200)
    function (r, textStatus, xhr) {
      myApp.toast('تم الإرسال', '✓', { duration: 2000 }).show();

      $$('#confetti').show();
      $$('#confetti').addClass('start');
      confetti.start();
      setTimeout(() => {
        $$('#confetti').removeClass('start');
        setTimeout(() => {
          confetti.stop();
          $$('#confetti').hide();
        }, "1000");
      }, "4000");

      $$('[data-elm="share-message"]').addClass('disabled');
      $$('[data-elm="new-message"]').show();
      $$('[data-elm="new-message"]').css('display', 'flex');
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
    });
});

$$('[data-elm=copy-button]').on('click', function () {
  var textToCopy = $$('[data-elm="message-share-link"]')[0].textContent;
  var tempTextarea = document.createElement('textarea');
  tempTextarea.value = textToCopy;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextarea);
  myApp.toast('تم نسخ الرابط', { duration: 2000 }).show();
});

// Add click event listener to the envelope
$$(document).on('click', '.envelope', function () {
  // Extract the message ID and index from the data-key
  var uniqueKey = $$(this).attr('data-key');
  const [messageId, responseIndex] = uniqueKey.split('-');
  const responseContent = getResponseContent(Number(messageId), Number(responseIndex));

  var inmatedEmojiFrames = setInterval(function() {
    var r_num = Math.floor(Math.random() * 40) + 1;
    var r_size = Math.floor(Math.random() * 65) + 10;
    var r_left = Math.floor(Math.random() * 100) + 1;
    var r_time = Math.floor(Math.random() * 5) + 5;

    $$('.page').append("<div class='inmated-emoji' style='z-index:1; font-size:" + r_size + "px; left:" + r_left + "%; -webkit-animation:inmatedEmojiFrames " + r_time + "s ease; -moz-animation:inmatedEmojiFrames " + r_time + "s ease; -ms-animation:inmatedEmojiFrames " + r_time + "s ease; animation:inmatedEmojiFrames " + r_time + "s ease'>"+responseContent.reaction+"</div>");
    $$('.page').append("<div class='inmated-emoji' style='z-index:1; font-size:" + (r_size - 10) + "px; left:" + (r_left + r_num) + "%; -webkit-animation:inmatedEmojiFrames " + (r_time + 5) + "s ease; -moz-animation:inmatedEmojiFrames " + (r_time + 5) + "s ease; -ms-animation:inmatedEmojiFrames " + (r_time + 5) + "s ease; animation:inmatedEmojiFrames " + (r_time + 5) + "s ease'>"+responseContent.reaction+"</div>");

    $$('.inmated-emoji').each(function() {
      var top = $$(this).css("top").replace(/[^-\d\.]/g, '');
      var width = $$(this).css("width").replace(/[^-\d\.]/g, '');
      if (top <= -100 || width >= 150) {
        // $$(this).detach();
        $$(this).remove();
      }
    });
  }, 150);
  setTimeout(() => {
    clearInterval(inmatedEmojiFrames);
  }, "2500");
  setTimeout(() => {
    $$('.inmated-emoji').each(function() {
      var top = $$(this).css("top").replace(/[^-\d\.]/g, '');
      var width = $$(this).css("width").replace(/[^-\d\.]/g, '');
      if (top <= -100 || width >= 150) {
        // $$(this).detach();
        $$(this).remove();
      }
    });
  }, "10000");

  // Retrieve or initialize openedResponses from localStorage
  let openedResponses = JSON.parse(getThis('openedResponses')) || {};

  // Check if the envelope is not already opened
  if (!openedResponses[uniqueKey]) {
    // Mark as opened in localStorage
    openedResponses[uniqueKey] = 1;
    setThis('openedResponses', JSON.stringify(openedResponses));

    // show the emoji
    $$(this).css('opacity','0');
    setTimeout(() => {
      $$(this).removeClass('envelope').addClass('emoji').html(responseContent.reaction);
      $$(this).css('opacity','1');
    }, "800");

    // increase counter by 1
    var emojiCounterElmContainer = $$(this).parent().find("[data-elm=responsesContainer]>[data-elm="+responseContent.reaction+"]");
    emojiCounterElmContainer.css('opacity', '1');
    var emojiCounterElm = $$(this).parent().find("[data-elm=responsesContainer]>[data-elm="+responseContent.reaction+"]>div");
    emojiCounterElm.text(parseInt(emojiCounterElm.text())+1);

    // Update the envelope icon and add 'open' class
    // $$(this).addClass('open');
    // $$(this).html('<i></i>').addClass('fa-envelope-open');
  }
});

// Add click event listener to the emoji
$$(document).on('click', '.emoji', function () {
  // Extract the message ID and index from the data-key
  var uniqueKey = $$(this).attr('data-key');
  const [messageId, responseIndex] = uniqueKey.split('-');
  const responseContent = getResponseContent(Number(messageId), Number(responseIndex));
  
  var inmatedEmojiFrames = setInterval(function() {
    var r_num = Math.floor(Math.random() * 40) + 1;
    var r_size = Math.floor(Math.random() * 65) + 10;
    var r_left = Math.floor(Math.random() * 100) + 1;
    var r_time = Math.floor(Math.random() * 5) + 5;

    $$('.page').append("<div class='inmated-emoji' style='z-index:1; font-size:" + r_size + "px; left:" + r_left + "%; -webkit-animation:inmatedEmojiFrames " + r_time + "s ease; -moz-animation:inmatedEmojiFrames " + r_time + "s ease; -ms-animation:inmatedEmojiFrames " + r_time + "s ease; animation:inmatedEmojiFrames " + r_time + "s ease'>"+responseContent.reaction+"</div>");
    $$('.page').append("<div class='inmated-emoji' style='z-index:1; font-size:" + (r_size - 10) + "px; left:" + (r_left + r_num) + "%; -webkit-animation:inmatedEmojiFrames " + (r_time + 5) + "s ease; -moz-animation:inmatedEmojiFrames " + (r_time + 5) + "s ease; -ms-animation:inmatedEmojiFrames " + (r_time + 5) + "s ease; animation:inmatedEmojiFrames " + (r_time + 5) + "s ease'>"+responseContent.reaction+"</div>");

    $$('.inmated-emoji').each(function() {
      var top = $$(this).css("top").replace(/[^-\d\.]/g, '');
      var width = $$(this).css("width").replace(/[^-\d\.]/g, '');
      if (top <= -100 || width >= 150) {
        // $$(this).detach();
        $$(this).remove();
      }
    });
  }, 150);
  setTimeout(() => {
    clearInterval(inmatedEmojiFrames);
  }, "2500");
  setTimeout(() => {
    $$('.inmated-emoji').each(function() {
      var top = $$(this).css("top").replace(/[^-\d\.]/g, '');
      var width = $$(this).css("width").replace(/[^-\d\.]/g, '');
      if (top <= -100 || width >= 150) {
        // $$(this).detach();
        $$(this).remove();
      }
    });
  }, "10000");
});

var getRandomMessageCall = false;
function getRandomMessage() {
  if(!getRandomMessageCall) getRandomMessageCall = true;
  else return false;

  $$('[data-elm="step2"]').addClass('disabled');

  // First AJAX: Get a random message
  $$.doAJAX('available-messages/random', { GUID: userGUID }, 'GET', true,
    // Success (200) - when random message is successfully retrieved
    function (r, textStatus, xhr) {
      $$('.random-message').html(r.message);
      $$('.dice').removeClass('shake-animation');
    
      $$('[data-elm="step2"]').removeClass('disabled');

      $$('[data-elm="show-share-link"]').show();
      $$('[data-elm="share-link-container"]').hide();
      $$('[data-elm="share-message"]').removeClass('disabled');
    
      // Prepare the public message parameters with the random message data
      msgParms = { message_id: r.id, message: r.message };
      // Second AJAX: Send the public message

      getRandomMessageCall = false;
    },
    // Failed to retrieve random message
    function (xhr, textStatus) {
      failedNotification4AjaxRequest(xhr, textStatus);
      $$('.dice').removeClass('shake-animation');
      getRandomMessageCall = false;
    });
}

function getSentMessages(hideIndicator = true) {
  const messagesContainer = $$('[data-elm="messages-container"]');
  messagesContainer.empty();

  // Retrieve or initialize openedResponses from localStorage
  let openedResponses = JSON.parse(getThis('openedResponses')) || {};

  $$.doAJAX('messages/user-sent-messages', { GUID: userGUID }, 'GET', hideIndicator,
    // Success (200) - when user messages are successfully retrieved
    function (r, textStatus, xhr) {
      sentMessages = r;

      // Flag to check if any message has responses
      let hasResponses = false;

      sentMessages.slice().reverse().forEach((messageObj) => {
        const { message, id, responses } = messageObj;

        // Create message container
        const oneMessageContainer = $$('<div></div>').addClass('message-container');
        messagesContainer.append(oneMessageContainer);

        // Append the message text to the element
        const messageDiv = $$('<div class="sent-message"></div>').text(message);
        oneMessageContainer.append(messageDiv);

        // Check if the message has responses
        if (responses.length > 0) {
          hasResponses = true; // Set the flag to true if there's at least one response

          var emojiCounter = []; // count each emoji

          responses.forEach((response, index) => {
            // Create a unique key by concatenating message id and index
            const uniqueKey = `${id}-${index}`;

            // Check if the envelope has been opened in localStorage
            const isOpened = openedResponses[uniqueKey] === 1;
            if (isOpened) {
              var responsesDiv = $$('<div></div>').addClass('emoji').html(response.reaction);
              if(response.type == 'emoji') emojiCounter[response.reaction] = 1 + (emojiCounter[response.reaction] || 0);

              // If opened, add the "open" class
              // responsesDiv.addClass('open');
              // const envelopeIcon = $$('<i></i>').addClass('fa fa-envelope-open');
              // responsesDiv.append(envelopeIcon);
            } 
            // Create the envelope div for each response
            else {
              var responsesDiv = $$('<div></div>').addClass('envelope');

              // If opened, add the "open" class
              const envelopeIcon = $$('<i></i>').addClass('fa fa-envelope');
              responsesDiv.append(envelopeIcon);
            }

            responsesDiv.attr('data-key', uniqueKey);

            oneMessageContainer.append(responsesDiv);
          });

          // availableResponses.forEach(res => {
          //   responsesContainer.append(`
          //     <span id="${res.id}">${res.reaction}</span>
          //   `);
          // });
          oneMessageContainer.append(`
            <div data-elm="responsesContainer" style="width: 100%;display: flex ;justify-content: space-between;background: #6696c6;padding: 15px;border-radius: 15px;text-align: center;">
              <div data-elm="👍" style="`+((emojiCounter["👍"] || 0) > 0 ? '': 'opacity: 0.4;')+`transition: opacity 1s ease-in-out;padding: 8px 0px;font-size: 30px;">
                👍
                <div style="font-size:16px;">`+(emojiCounter["👍"] || 0)+`</div>
              </div>
              <div data-elm="❤️" style="`+((emojiCounter["❤️"] || 0) > 0 ? '': 'opacity: 0.4;')+`transition: opacity 1s ease-in-out;padding: 8px 0px;font-size: 30px;">
                ❤️
                <div style="font-size:16px;">`+(emojiCounter["❤️"] || 0)+`</div>
              </div>
              <div data-elm="😂" style="`+((emojiCounter["😂"] || 0) > 0 ? '': 'opacity: 0.4;')+`transition: opacity 1s ease-in-out;padding: 8px 0px;font-size: 30px;">
                😂
                <div style="font-size:16px;">`+(emojiCounter["😂"] || 0)+`</div>
              </div>
              <div data-elm="😮" style="`+((emojiCounter["😮"] || 0) > 0 ? '': 'opacity: 0.4;')+`transition: opacity 1s ease-in-out;padding: 8px 0px;font-size: 30px;">
                😮
                <div style="font-size:16px;">`+(emojiCounter["😮"] || 0)+`</div>
              </div>
              <div data-elm="😢" style="`+((emojiCounter["😢"] || 0) > 0 ? '': 'opacity: 0.4;')+`transition: opacity 1s ease-in-out;padding: 8px 0px;font-size: 30px;">
                😢
                <div style="font-size:16px;">`+(emojiCounter["😢"] || 0)+`</div>
              </div>
            </div>`);
        } else {
          oneMessageContainer.append(`
            <div style="padding: 10px; width: 100%; text-align: center; color: #ccc;">الردود قادمة!</div>
          `);
        }
      });

      // If no message has responses, show the notification
      if (!hasResponses) {
        messagesContainer.append(`
          <span>لا يوجد ردود...</span>
        `);
      } else {
        setThis('showStep2', 1);
        setThis('showStep3', 1);
        $$('[data-elm="step2"]').addClass('show');
        $$('[data-elm="step3"]').addClass('show');
        $$('[data-elm="go2step2"]').hide();
        $$('[data-elm="go2step3"]').hide();
      }
    },
    // Failed to retrieve messages
    function (xhr, textStatus) {
      failedNotification4AjaxRequest(xhr, textStatus);
    });
}

function getReceivedMessages(hideIndicator = true) {
  $$('[data-elm="inbox-num"]').hide();
  $$('[data-elm="inbox-num"]').text('');
  removeThis('openedMessages');

  $$.doAJAX('messages/user-received-messages', {}, 'GET', hideIndicator,
  // Success (200)
  function (r, textStatus, xhr) {
    if(r.length > 0) {
      receivedMessages = r;

      // Check if the message is not already opened
      let openedMessages = JSON.parse(getThis('openedMessages')) || {};
      for (const oMsg of r) {
        if(oMsg.is_opened) {
          openedMessages[oMsg.id] = 1; // Mark as opened by setting value to 1
        }
      }
      // Update localStorage with the new openedMessages object
      setThis('openedMessages', JSON.stringify(openedMessages));
  
      let newMessagesCount = Math.abs(Object.keys(openedMessages).length - r.length);
      if(Object.keys(openedMessages).length != r.length) {
        $$('[data-elm="inbox-num"]').show();
        $$('[data-elm="inbox-num"]').text(newMessagesCount);
      }

      // Check if there is messages not already opened
      if(newMessagesCount > 0) {
        for (const nMsg of r) {
          // Check if the message ID exists in openedMessages; if not, it's unread
          const isOpened = openedMessages[nMsg.id] === 1;

          $$('[data-elm="inbox-btn"]').attr('href', '#');
          $$('[data-elm="inbox-btn"]').addClass('open-picker');
          $$('[data-elm="inbox-btn"]').attr('data-picker', '.picker-respond-to-message');
          $$('.picker-respond-to-message').attr('data-messageID', nMsg.id);

          if (!isOpened) {
            break;
          }
        }
      } else {
        // $$('[data-elm="inbox-btn"]').attr('href', 'inbox.html');
        // $$('[data-elm="inbox-btn"]').removeClass('open-picker');
        // $$('[data-elm="inbox-btn"]').attr('data-picker', '');
        // $$('.picker-respond-to-message').attr('data-messageID', '');
      }

      // setThis('showStep2', 1);
      // setThis('showStep3', 1);
      // $$('[data-elm="step2"]').addClass('show');
      // $$('[data-elm="step3"]').addClass('show');
      // $$('[data-elm="go2step2"]').hide();
      // $$('[data-elm="go2step3"]').hide();
    }
  },
  // Failed
  function (xhr, textStatus) {
    // Failed notification
    failedNotification4AjaxRequest(xhr, textStatus);
  });

  $$.doAJAX('available-responses', {}, 'GET', true,
  // Success (200)
  function (r, textStatus, xhr) {
    availableResponses = r;
  },
  // Failed
  function (xhr, textStatus) {
    failedNotification4AjaxRequest(xhr, textStatus);
  });
}

$$('.picker-respond-to-message').on('open', function () {
  let message_id = $$(this).attr('data-messageID');
  let messageObj = receivedMessages.find(message => message.id == message_id);
  $$('[data-elm="message-content"]').text(messageObj.message);
  if(messageObj.sender) {
    $$('[data-elm="sender-name"]').text(messageObj.sender.name);
    $$('[data-elm="sender-image"]').attr('src', messageObj.sender.profile_picture ? imagePath + messageObj.sender.profile_picture : "img/user-pic.svg");
  } else {
    $$('[data-elm="sender-name"]').text('');
    $$('[data-elm="sender-image"]').attr('src', "img/user-pic.svg");
  }
  $$('[data-elm="available-responses"]').html('');
  availableResponses.forEach(res => {
    $$('[data-elm="available-responses"]').append(`
      <span class="close-picker" data-elm="reply" id="${res.id}">${res.reaction}</span>
    `);
  });
});

$$(document).on('click', '[data-elm="reply"]', function () {
  let message_id = $$('.picker-respond-to-message').attr('data-messageID');
  let response_id = $$(this).attr('id');
  let reply = { message_id: message_id, available_response_id: response_id, is_anonymous: 0 }

  $$.doAJAX('messages/respond-to-message', reply , 'POST', false,
  // Success (200) - when random message is successfully retrieved
  function (r, textStatus, xhr) {
    myApp.toast('تم إرسال تعبيرك', '✓', { duration: 2000 }).show();
    let openedMessages = JSON.parse(getThis('openedMessages')) || {};
    // After appending, add this message ID to openedMessages if not already present
    if (!openedMessages[message_id]) {
      openedMessages[message_id] = 1; // Mark as opened by setting value to 1
    }
    // Update localStorage with the new openedMessages object
    setThis('openedMessages', JSON.stringify(openedMessages));


    let newMessagesCount = Math.abs(Object.keys(openedMessages).length - receivedMessages.length);

    $$('[data-elm="inbox-num"]').hide();
    if(Object.keys(openedMessages).length != r.length) {
      $$('[data-elm="inbox-num"]').show();
      $$('[data-elm="inbox-num"]').text(newMessagesCount);
    }

    // Check if there is messages not already opened
    if(newMessagesCount > 0) {
      for (const msg of receivedMessages) {
        // Check if the message ID exists in openedMessages; if not, it's unread
        const isOpened = openedMessages[msg.id] === 1;

        $$('[data-elm="inbox-btn"]').attr('href', '#');
        $$('[data-elm="inbox-btn"]').addClass('open-picker');
        $$('[data-elm="inbox-btn"]').attr('data-picker', '.picker-respond-to-message');
        $$('.picker-respond-to-message').attr('data-messageID', msg.id);

        if (!isOpened) {
          break;
        }
      }
    } else {
      $$('[data-elm="inbox-num"]').hide();
      $$('[data-elm="inbox-btn"]').attr('href', '#');
      $$('[data-elm="inbox-btn"]').removeClass('open-picker');
      $$('[data-elm="inbox-btn"]').attr('data-picker', '');
      $$('.picker-respond-to-message').attr('data-messageID', '');
      // $$('[data-elm="inbox-btn"]').attr('href', 'inbox.html');
      // $$('[data-elm="inbox-btn"]').removeClass('open-picker');
      // $$('[data-elm="inbox-btn"]').attr('data-picker', '');
      // $$('.picker-respond-to-message').attr('data-messageID', '');
    }
  },
  // Failed
  function (xhr, textStatus) {
    // Failed notification
    failedNotification4AjaxRequest(xhr, textStatus);
  });
});

// Function to get response content by message ID and index
function getResponseContent(messageId, index) {
  // Find the message with the given message ID
  const messageObj = sentMessages.find((msg) => msg.id === messageId);

  // If the message is found and has responses, return the specific response
  if (messageObj && messageObj.responses.length > index) {
    return messageObj.responses[index];
  }

  return null; // Return null if no response found
}

$$('[data-elm="delete-account"]').on('click',function() {
  myApp.modal({
    title: `
    <div class="delete-modal">
      <div class="delete-modal-img">
      </div>
      <span>هل أنت متأكد من حذف الحساب؟</span>
    </div>`,
    text: 'يؤسفنا ان تغادرنا، اذا كان هناك ما نستطيع ان نقدمه لتغيير رأيك فنأمل التواصل معنا لمساعدتك.<br />أنت على وشك حذف هذا الحساب بشكل دائم..',
    buttons: [
      {
        text: '<span class="cancel" data-i18n-key="cancel">إلغاء</span>',
      },
      {
        text: '<span class="delete" data-i18n-key="delete">حذف</span>',
        onClick: function () {
          $$.doAJAX('users/delete-account', {}, 'POST', false,
            // Success (200)
            function (r, textStatus, xhr) {
              myApp.closeModal('.popup-settings')
              initUserLogedout();
            },
            // Failed
            function (xhr, textStatus) {
              // Failed notification
                failedNotification4AjaxRequest(xhr, textStatus);
            });
        }

      },
    ]
  });
});

$$('.picker-send-message').on('open', function () {
  endInterval = false;
  write(0);
});

$$('.picker-send-message').on('closed', function () {
  endInterval = true;
});

function write(num) {
  num = (num >= textArray.length ? 0 : num); // restart

  var timer;
  var text = textArray[num];
  var currentLetter = 0;

  //add letter by letter
  $$('.picker-send-message [name=message]').attr('placeholder', '');
  timer = setInterval(function() {
    if(endInterval) clearInterval(timer);

    $$('.picker-send-message [name=message]').attr('placeholder', ($$('.picker-send-message [name=message]').attr('placeholder') || '')+text[currentLetter]);

    // if it's end of text, call erase function.
    if (currentLetter == text.length-1) {
      clearInterval(timer);
      setTimeout(function() {erase(num);}, 1000);
    }

    currentLetter++;
  }, 100);
}

function erase(num) {
  var timer = '';
  var text = textArray[num];
  var currentLetter = text.length - 1;

  // remove one letter from the end of text
  timer = setInterval(function() {
    if(endInterval) clearInterval(timer);

    $$('.picker-send-message [name=message]').attr('placeholder', text.substring(0, currentLetter));

    // if no more text - write text back;
    if (currentLetter == 0) {
      clearInterval(timer);
      setTimeout(function() {write(num+1);}, 1000);
    }

    currentLetter--;
  }, 2);
}








var frameRate = 30;
var dt = 1.0 / frameRate;
var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180 / Math.PI;
var colors = [
    ["#df0049", "#660671"],
    ["#00e857", "#005291"],
    ["#2bebbc", "#05798a"],
    ["#ffd200", "#b06c00"]
];

function Vector2(_x, _y) {
    this.x = _x, this.y = _y;
    this.Length = function() {
        return Math.sqrt(this.SqrLength());
    }
    this.SqrLength = function() {
        return this.x * this.x + this.y * this.y;
    }
    this.Equals = function(_vec0, _vec1) {
        return _vec0.x == _vec1.x && _vec0.y == _vec1.y;
    }
    this.Add = function(_vec) {
        this.x += _vec.x;
        this.y += _vec.y;
    }
    this.Sub = function(_vec) {
        this.x -= _vec.x;
        this.y -= _vec.y;
    }
    this.Div = function(_f) {
        this.x /= _f;
        this.y /= _f;
    }
    this.Mul = function(_f) {
        this.x *= _f;
        this.y *= _f;
    }
    this.Normalize = function() {
        var sqrLen = this.SqrLength();
        if (sqrLen != 0) {
            var factor = 1.0 / Math.sqrt(sqrLen);
            this.x *= factor;
            this.y *= factor;
        }
    }
    this.Normalized = function() {
        var sqrLen = this.SqrLength();
        if (sqrLen != 0) {
            var factor = 1.0 / Math.sqrt(sqrLen);
            return new Vector2(this.x * factor, this.y * factor);
        }
        return new Vector2(0, 0);
    }
}
Vector2.Lerp = function(_vec0, _vec1, _t) {
    return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
}
Vector2.Distance = function(_vec0, _vec1) {
    return Math.sqrt(Vector2.SqrDistance(_vec0, _vec1));
}
Vector2.SqrDistance = function(_vec0, _vec1) {
    var x = _vec0.x - _vec1.x;
    var y = _vec0.y - _vec1.y;
    return (x * x + y * y + z * z);
}
Vector2.Scale = function(_vec0, _vec1) {
    return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
}
Vector2.Min = function(_vec0, _vec1) {
    return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
}
Vector2.Max = function(_vec0, _vec1) {
    return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
}
Vector2.ClampMagnitude = function(_vec0, _len) {
    var vecNorm = _vec0.Normalized;
    return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
}
Vector2.Sub = function(_vec0, _vec1) {
    return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
}

function EulerMass(_x, _y, _mass, _drag) {
    this.position = new Vector2(_x, _y);
    this.mass = _mass;
    this.drag = _drag;
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.AddForce = function(_f) {
        this.force.Add(_f);
    }
    this.Integrate = function(_dt) {
        var acc = this.CurrentForce(this.position);
        acc.Div(this.mass);
        var posDelta = new Vector2(this.velocity.x, this.velocity.y);
        posDelta.Mul(_dt);
        this.position.Add(posDelta);
        acc.Mul(_dt);
        this.velocity.Add(acc);
        this.force = new Vector2(0, 0);
    }
    this.CurrentForce = function(_pos, _vel) {
        var totalForce = new Vector2(this.force.x, this.force.y);
        var speed = this.velocity.Length();
        var dragVel = new Vector2(this.velocity.x, this.velocity.y);
        dragVel.Mul(this.drag * this.mass * speed);
        totalForce.Sub(dragVel);
        return totalForce;
    }
}

function ConfettiPaper(_x, _y) {
    this.pos = new Vector2(_x, _y);
    this.rotationSpeed = Math.random() * 600 + 800;
    this.angle = DEG_TO_RAD * Math.random() * 360;
    this.rotation = DEG_TO_RAD * Math.random() * 360;
    this.cosA = 1.0;
    this.size = 5.0;
    this.oscillationSpeed = Math.random() * 1.5 + 0.5;
    this.xSpeed = 40.0;
    this.ySpeed = Math.random() * 60 + 50.0;
    this.corners = new Array();
    this.time = Math.random();
    var ci = Math.round(Math.random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    for (var i = 0; i < 4; i++) {
        var dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
        var dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
        this.corners[i] = new Vector2(dx, dy);
    }
    this.Update = function(_dt) {
        this.time += _dt;
        this.rotation += this.rotationSpeed * _dt;
        this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
        this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
        this.pos.y += this.ySpeed * _dt;
        if (this.pos.y > ConfettiPaper.bounds.y) {
            this.pos.x = Math.random() * ConfettiPaper.bounds.x;
            this.pos.y = 0;
        }
    }
    this.Draw = function(_g) {
        if (this.cosA > 0) {
            _g.fillStyle = this.frontColor;
        } else {
            _g.fillStyle = this.backColor;
        }
        _g.beginPath();
        _g.moveTo(this.pos.x + this.corners[0].x * this.size, this.pos.y + this.corners[0].y * this.size * this.cosA);
        for (var i = 1; i < 4; i++) {
            _g.lineTo(this.pos.x + this.corners[i].x * this.size, this.pos.y + this.corners[i].y * this.size * this.cosA);
        }
        _g.closePath();
        _g.fill();
    }
}
ConfettiPaper.bounds = new Vector2(0, 0);

function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
    this.particleDist = _dist;
    this.particleCount = _count;
    this.particleMass = _mass;
    this.particleDrag = _drag;
    this.particles = new Array();
    var ci = Math.round(Math.random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    this.xOff = Math.cos(DEG_TO_RAD * _angle) * _thickness;
    this.yOff = Math.sin(DEG_TO_RAD * _angle) * _thickness;
    this.position = new Vector2(_x, _y);
    this.prevPosition = new Vector2(_x, _y);
    this.velocityInherit = Math.random() * 2 + 4;
    this.time = Math.random() * 100;
    this.oscillationSpeed = Math.random() * 2 + 2;
    this.oscillationDistance = Math.random() * 40 + 40;
    this.ySpeed = Math.random() * 40 + 80;
    for (var i = 0; i < this.particleCount; i++) {
        this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
    }
    this.Update = function(_dt) {
        var i = 0;
        this.time += _dt * this.oscillationSpeed;
        this.position.y += this.ySpeed * _dt;
        this.position.x += Math.cos(this.time) * this.oscillationDistance * _dt;
        this.particles[0].position = this.position;
        var dX = this.prevPosition.x - this.position.x;
        var dY = this.prevPosition.y - this.position.y;
        var delta = Math.sqrt(dX * dX + dY * dY);
        this.prevPosition = new Vector2(this.position.x, this.position.y);
        for (i = 1; i < this.particleCount; i++) {
            var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
            dirP.Normalize();
            dirP.Mul((delta / _dt) * this.velocityInherit);
            this.particles[i].AddForce(dirP);
        }
        for (i = 1; i < this.particleCount; i++) {
            this.particles[i].Integrate(_dt);
        }
        for (i = 1; i < this.particleCount; i++) {
            var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
            rp2.Sub(this.particles[i - 1].position);
            rp2.Normalize();
            rp2.Mul(this.particleDist);
            rp2.Add(this.particles[i - 1].position);
            this.particles[i].position = rp2;
        }
        if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
            this.Reset();
        }
    }
    this.Reset = function() {
        this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
        this.position.x = Math.random() * ConfettiRibbon.bounds.x;
        this.prevPosition = new Vector2(this.position.x, this.position.y);
        this.velocityInherit = Math.random() * 2 + 4;
        this.time = Math.random() * 100;
        this.oscillationSpeed = Math.random() * 2.0 + 1.5;
        this.oscillationDistance = Math.random() * 40 + 40;
        this.ySpeed = Math.random() * 40 + 80;
        var ci = Math.round(Math.random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        this.particles = new Array();
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
        }
    }
    this.Draw = function(_g) {
        for (var i = 0; i < this.particleCount - 1; i++) {
            var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
            var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
            if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
                _g.fillStyle = this.frontColor;
                _g.strokeStyle = this.frontColor;
            } else {
                _g.fillStyle = this.backColor;
                _g.strokeStyle = this.backColor;
            }
            if (i == 0) {
                _g.beginPath();
                _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
                _g.closePath();
                _g.stroke();
                _g.fill();
                _g.beginPath();
                _g.moveTo(p1.x, p1.y);
                _g.lineTo(p0.x, p0.y);
                _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
                _g.closePath();
                _g.stroke();
                _g.fill();
            } else if (i == this.particleCount - 2) {
                _g.beginPath();
                _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
                _g.closePath();
                _g.stroke();
                _g.fill();
                _g.beginPath();
                _g.moveTo(p1.x, p1.y);
                _g.lineTo(p0.x, p0.y);
                _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
                _g.closePath();
                _g.stroke();
                _g.fill();
            } else {
                _g.beginPath();
                _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                _g.lineTo(p1.x, p1.y);
                _g.lineTo(p0.x, p0.y);
                _g.closePath();
                _g.stroke();
                _g.fill();
            }
        }
    }
    this.Side = function(x1, y1, x2, y2, x3, y3) {
        return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
    }
}
ConfettiRibbon.bounds = new Vector2(0, 0);

confetti = {};
confetti.Context = function(parent) {
    var i = 0;
    var canvasParent = document.getElementById(parent);
    var canvas = document.createElement('canvas');
    canvas.width = canvasParent.offsetWidth;
    canvas.height = canvasParent.offsetHeight;
    canvasParent.appendChild(canvas);
    var context = canvas.getContext('2d');
    var interval = null;
    var confettiRibbonCount = 7;
    var rpCount = 30;
    var rpDist = 8.0;
    var rpThick = 8.0;
    var confettiRibbons = new Array();
    ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
    for (i = 0; i < confettiRibbonCount; i++) {
        confettiRibbons[i] = new ConfettiRibbon(Math.random() * canvas.width, -Math.random() * canvas.height * 2, rpCount, rpDist, rpThick, 45, 1, 0.05);
    }
    var confettiPaperCount = 25;
    var confettiPapers = new Array();
    ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
    for (i = 0; i < confettiPaperCount; i++) {
        confettiPapers[i] = new ConfettiPaper(Math.random() * canvas.width, Math.random() * canvas.height);
    }
    this.resize = function() {
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
        ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
        ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
    }
    this.start = function() {
        this.stop()
        var context = this
        this.interval = setInterval(function() {
            confetti.update();
        }, 1000.0 / frameRate)
    }
    this.stop = function() {
        clearInterval(this.interval);
    }
    this.update = function() {
        var i = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < confettiPaperCount; i++) {
            confettiPapers[i].Update(dt);
            confettiPapers[i].Draw(context);
        }
        for (i = 0; i < confettiRibbonCount; i++) {
            confettiRibbons[i].Update(dt);
            confettiRibbons[i].Draw(context);
        }
    }
}
var confetti = new confetti.Context('confetti');
$$('#confetti').hide();
