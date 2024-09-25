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
  if (typeof userLogedin != "undefined" && typeof userGUID != "undefined")
    if (path == "users/login")
      headers = { 'accept': 'application/json' };
    else
      headers = { 'accept': 'application/json', 'GUID': userGUID };
  console.log(userGUID)
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
});


// ======================================
// REGISTER/LOGIN SCREEN
// ======================================
// pagination handle
myApp.swiper('.login-screen .slider-onboarding', {
  prevButton: '.login-screen .navbar .swiper-back',
  nextButton: '.login-screen .register-footer button.next-slide',
  noSwiping: true,
  noSwipingClass: 'no-swiping',
  //paginationClickable: false,
  //pagination: '.login-screen .pagination',
  //paginationType: 'progress',
  onInit: function (s) {
    if (s.activeIndex === 0) {
      $$('.login-screen-content .quarter-circle').css('display', 'none');
      $$('.login-screen .navbar .swiper-back').css('display', 'none');
      $$('.login-screen .onboarding-progress').css('visibility', 'hidden');
    }
  },
  onSlideChangeStart: function (s) {
    $$('.onboarding-progress .percentage').css('width', 'calc(' + (s.activeIndex + 1) + ' / ' + (s.slides.length - 1) + ' * 100%');

    var $progress = $$('.login-screen .onboarding-progress');
    var $back = $$('.login-screen .navbar .swiper-back');

    $$('.login-screen-content .quarter-circle').css('display', 'block');
    $back.css('display', 'block');
    $progress.css('visibility', 'visible');

    if (s.activeIndex === 0) {
      $$('.login-screen-content .quarter-circle').css('display', 'none');
      $back.css('display', 'none');
      $progress.css('visibility', 'hidden');
    }

    if (s.activeIndex + 1 === s.slides.length) {
      $progress.css('visibility', 'hidden');
    }
  },
});

$$('.signInFormLink').on('click', function (e) {
  e.preventDefault();

  // close popups
  myApp.closeModal('.popup-login');
  myApp.closeModal('.login-screen');
});


$$('[data-elm="guest-name"]').on('input', function () {
  var input = $$(this).val().replace(/\s/g, ''); // Remove spaces
  if (input.length >= 3) {
    $$('.modal-button').removeClass('disabled'); // Enable the OK button
  } else {
    $$('.modal-button').addClass('disabled'); // Disable the OK button
  }
});

$$('[data-elm="close-welcome-screen"]').on('click', function () {

})


$$('.signUpForm-to-json').on('click', function (e) {
  e.preventDefault();

  // get form parameters
  var SignUPForm_parms = myApp.formToJSON('#signUpForm');
  delete SignUPForm_parms.terms;
  $$.doAJAX('users/register', SignUPForm_parms, 'POST', false,
    // Success (200)
    function (r, textStatus, xhr) {
      console.log(r)
      initUserLoggedIn();

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
      console.log(r)
      setThis("logedinUser", 1);
      setThis('userData', JSON.stringify(r));
      myApp.closeModal('.popup-login')

      initUserLoggedIn();

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

if (typeof getThis("logedinUser") !== "undefined" && getThis("logedinUser") == 1) { initUserLoggedIn(); }

function initUserLoggedIn() {
  userLogedin = true;
  user = new User(JSON.parse(getThis("userData")));
  userGUID = user.guid;
  getRandomMs();
  $$('*[data-elm="user-name"]').text(user.name);
  $$('*[data-elm="user-name"]').val(user.name);
  $$('.navbar-user-name').hide();
  $$('.logout').show();

  if (user.profilePicture) {
    $$('.image-preview').attr('src', user.profilePicture);
  } else {
    $$('.image-preview').attr('src', 'img/user-pic.svg');

  }
}

// logout and clear all stored data
function initUserLogedout() {
  //clear all data
  if (useDB) {
    DB_data = [];
    db.executeSql('UPDATE user_main_data SET json_result = ?', ['{}']);
  } else {
    localStorage.clear();
  }
  // document.getElementsByClassName("login-screen")[0].style.visibility = "initial";
  // $$(".open-login-screen").click();
  // if (!$$(".login-screen").hasClass('modal-in')) {
  //   $$(".login-screen").show();
  //   myApp.openModal('.login-screen');
  // }

  userLogedin = false;
  user = undefined;
  setThis("hideWelcomeScreen", 1);
  $$('.image-preview').attr('src', 'img/user-pic.svg');
  $$('*[data-elm="user-name"]').empty();
  $$('.navbar-user-name').show();
  $$('.logout').hide();

}

if (getThis('hideWelcomeScreen') == '1' && userLogedin != true) {
  myApp.modal({
    text: `
      <div class="guest-popup-inner">
        <span>من فضلك أدخل اسمك</span>
        <input type="text" data-elm="guest-name" placeholder="أدخل اسمك هنا" />
      </div>`,
    buttons: [
      {
        text: 'إرسـال',
        close: false, // prevent closing until valid input
        onClick: function () {
          var userName = $$('[data-elm="guest-name"]').val().trim();
          if (userName.length >= 3) {
            // Your callback logic here
            $$.doAJAX('users_info', { name: userName }, 'POST', true,
              // Success (200)
              function (r, textStatus, xhr) {
                if (typeof r != 'undefined' && r != null) {
                  userGUID = r.GUID;
                  console.log(r);
                }
              },
              // Failed
              function (xhr, textStatus) {
              });
            myApp.closeModal(); // close the modal after valid input
          }
        },
        disabled: true, // Initially disable the OK button
      },
    ],
  });

}

$$('.dice').on('click', function () {
  $$(this).addClass('shake-animation');
  getRandomMs();
});

function getRandomMs(){
  $$.doAJAX('available-messages/random', { GUID: userGUID }, 'GET', true,
    // Success (200)
    function (r, textStatus, xhr) {
      console.log(r)
      $$('.random-msg').text(r.message)
      $$('.random-msg').attr('key',r.id)
      $$('.dice').removeClass('shake-animation');
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
      $$('.dice').removeClass('shake-animation');

    });
}

$$('.random-msg').on('click',function(){
  let key=$$(this).attr('key');
  console.log(key);
  let message = {};
  message.availabe_message_id = key;
  message.is_random = 1;
  message.message = $$(this).text()
  console.log(message)
  $$.doAJAX(`messages`, message, 'POST', true,
    // Success (200)
    function (r, textStatus, xhr) {
      console.log(r)

    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
        failedNotification4AjaxRequest(xhr, textStatus);
    });
})

$$('#profile_picture').on('change', function (event) {
  var input = event.target;

  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $$('.image-preview').attr('src', e.target.result).css('display', 'block');
    };
    reader.readAsDataURL(input.files[0]); // Convert the file to a base64 string for preview
  }
});

$$('.changeSettingsForm').on('click', function (e) {
  e.preventDefault();

  // Get the form data using formToJSON
  var changeSettings = myApp.formToJSON('#change-settings');

  // Get the file input element
  var fileInput = $$('#profile_picture')[0];

  // Check if a file is selected
  if (fileInput && fileInput.files.length > 0) {
    var profilePicture = fileInput.files[0];

    // Use FileReader to read the file as an ArrayBuffer
    var reader = new FileReader();

    // Once the file is fully read
    reader.onloadend = function (e) {
      // Create a Blob from the ArrayBuffer
      var blob = new Blob([reader.result], { type: profilePicture.type });

      // Append the Blob to the changeSettings object
      changeSettings.profile_picture = blob;
      changeSettings._method = 'PUT';
      changeSettings.settings = null;

      console.log(JSON.stringify(changeSettings))

      // Send the changeSettings object via AJAX
      $$.ajax({
        url: encodeURI(`users_info/${userGUID}`),
        data: JSON.stringify(changeSettings),
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        processData: false,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + user.token
        },
        success: function (r, textStatus, xhr) {
          console.log(r);
        },
        error: function (xhr, textStatus) {
          // Failed notification
          failedNotification4AjaxRequest(xhr, textStatus);
        }
      });
    };

    // Read the file as an ArrayBuffer to create the Blob
    reader.readAsArrayBuffer(profilePicture);
  } else {
    changeSettings.profile_picture = null; // No file selected, set to null

    // Send the form data if no file was selected
    changeSettings._method = 'PUT';
    changeSettings.settings = null;

    $$.ajax({
      url: encodeURI(`users_info/${userGUID}`),
      data: JSON.stringify(changeSettings),
      type: 'POST',
      cache: false,
      contentType: 'application/json',
      processData: false,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + user.token,
        'GUID': userGUID,
      },
      success: function (r, textStatus, xhr) {
        console.log(r);
      },
      error: function (xhr, textStatus) {
        // Failed notification
        failedNotification4AjaxRequest(xhr, textStatus);
      }
    });
  }
});

$$('.envelope').on('click', function () {
  $$.doAJAX('available-responses', {}, 'GET', false,
    // Success (200)
    function (r, textStatus, xhr) {
      console.log(r)
      myApp.modal({
        text: `
        ${r.length === 0 ? `<div class="guest-popup-inner">
            <span>لا يوجد ردود بعد</span>
          </div>`: `<div class="guest-popup-inner">
            <span>من فضلك أدخل اسمك</span>
          </div>`}`,
        buttons: [
          {
            text: 'حسنًا',
          },
        ],
      });

    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      if (textStatus == 401)
        myApp.alert('البريد الإلكتروني غير صحيح.');
      else
        failedNotification4AjaxRequest(xhr, textStatus);
    });
})


$$('.logout').on('click', function () {
  initUserLogedout();
})