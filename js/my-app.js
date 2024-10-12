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
  if(getThis("userLogedin") != 1 && getThis("randomUserLogedin") != 1) createRandomUser();
});


// ======================================
// REGISTER/LOGIN
// ======================================
$$('.signUpForm-to-json').on('click', function (e) {
  e.preventDefault();
  var SignUPForm_parms = myApp.formToJSON('#signUpForm');
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
      else
        failedNotification4AjaxRequest(xhr, textStatus);
    });

  return false;
});

$$('.logout').on('click', function () {
  initUserLogedout();
})

function initUserLoggedIn() {
  if(getThis("userLogedin")) {
    userLogedin = true;
    $$('.navbar-user-name').hide();
    $$('.logout').show();
  }

  user = new User(JSON.parse(getThis("userData")));
  userGUID = user.guid;
  $$('*[data-elm="user-name"]').text(user.name);
  $$('*[data-elm="user-name"]').val(user.name);
  if (user.profilePicture) {
    $$('[data-elm="user-image"]').attr('src', imagePath + user.profilePicture);
  } else {
    $$('[data-elm="user-image"]').attr('src', 'img/user-pic.svg');
  }

  if(getThis('showStep2') == 1) {
    $$('[data-elm="step2"]').addClass('show');
  }
  if(getThis('showStep3') == 1) {
    $$('[data-elm="step3"]').addClass('show');
  }

  handleRandomPublicMessage();
  availableResponses();
}

// is Guest? then create random user 
function createRandomUser() {
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
          if (userName.length >= 2) {
            // Your callback logic here
            $$.doAJAX('users-info', { name: userName }, 'POST', true,
              // Success (200)
              function (r, textStatus, xhr) {
                if (typeof r != 'undefined' && r != null) {
                  setThis("randomUserLogedin", 1);
                  setThis("userData", JSON.stringify(r));

                  initUserLoggedIn()
                  handleRandomPublicMessage();
                }
              },
              // Failed
              function (xhr, textStatus) {
              });
            myApp.closeModal(); // close the modal after valid input
          } else {
            myApp.addNotification({ hold: 5000, title: 'تنبيه', message: 'الاسم قصير جداً! حاول مجدداً' });
          }
        }
      },
    ],
  });
}

function initUserLogedout() {
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
  $$('.logout').hide();

  setThis("hideWelcomeScreen", 1);
}

if(getThis("userLogedin") == 1 || getThis("randomUserLogedin") == 1) initUserLoggedIn();
else if (getThis('hideWelcomeScreen') == '1') createRandomUser();


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
});

$$('[data-elm="go2step3"]').on('click', function () {
  var step3 = $$('[data-elm="step3"]');
  step3.addClass('show');
  step3[0].scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the element
  setThis('showStep3', 1);
});


// ======================================
// MESSAGES AND RESPONCES
// ======================================
$$('.dice').on('click', function () {
  $$(this).addClass('shake-animation');
  handleRandomPublicMessage();
});

$$('.submit-message').on('click', function (e) {
  e.preventDefault();

  var submitMessage = myApp.formToJSON('#sendMessageForm');
  // submitMessage.available_message_id = 2;
  submitMessage.is_random = 1;
  console.log(submitMessage)

  $$.doAJAX(`messages`, submitMessage, 'POST', true,
    // Success (200)
    function (r, textStatus, xhr) {
      myApp.closeModal(".picker-send-message")
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
    });
});

$$('[data-elm="share-message"]').on('click', function () {
  let key = $$('.random-message').attr('key');
  let message = {};
  message.availabe_message_id = key;
  message.is_random = 1;
  message.message = $$('.random-message').text()
  $$.doAJAX(`messages`, message, 'POST', true,
    // Success (200)
    function (r, textStatus, xhr) {
      myApp.toast('تم الإرسال', '✓', { duration: 2000 }).show();
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

function availableResponses() {
  $$.doAJAX('available-responses', {}, 'GET', false,
    // Success (200)
    function (r, textStatus, xhr) {
      if (r.length == 0) {
        $$('[data-elm="available-responses"]').append(`
          <span>تنبيه لا يوحد ردود...</span>
        `);
      } else {
        setThis('showStep2', 1);
        setThis('showStep3', 1);
        $$('[data-elm="step2"]').addClass('show');
        $$('[data-elm="step3"]').addClass('show');
      
        r.forEach(res => {
          $$('[data-elm="available-responses"]').append(`
            <div class="envelope" data-reaction="${res.reaction}">
              <i class="fa fa-envelope" style="margin: auto;"></i>
            </div>
          `);
        });

        // Add click event listener to .envelope elements
        $$('.envelope').on('click', function () {
          const reaction = $$(this).data('reaction');
          myApp.modal({
            text: `
              <div class="guest-popup-inner">
                <span class="reaction">${reaction}</span>
              </div>
            `,
            buttons: [
              {
                text: 'حسنًا',
                onClick: function () {
                  $$('.present').css('display', 'none');
                }
              },
            ],
          });
        });
      }
    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      if (textStatus == 401)
        myApp.alert('البريد الإلكتروني غير صحيح.');
      else
        failedNotification4AjaxRequest(xhr, textStatus);
    });
}

function handleRandomPublicMessage() {
  // First AJAX: Get a random message
  $$.doAJAX('available-messages/random', { GUID: userGUID }, 'GET', true,
    // Success (200) - when random message is successfully retrieved
    function (r, textStatus, xhr) {
      $$('.random-message').text(r.message);
      $$('.random-message').attr('key', r.id);
      $$('.dice').removeClass('shake-animation');

      // Prepare the public message parameters with the random message data
      let publicMsgParms = { message_id: r.id, message: r.message };
      // Second AJAX: Send the public message
      $$.doAJAX('public-messages', publicMsgParms, 'POST', true,
        // Success (200) - when public message is successfully sent
        function (r, textStatus, xhr) {
          $$('[data-elm="message-share-link"]').text(r.sharing_url);
        },
        // Failed to send public message
        function (xhr, textStatus) {
          failedNotification4AjaxRequest(xhr, textStatus);
          reject("Failed to send public message");
        });

    },
    // Failed to retrieve random message
    function (xhr, textStatus) {
      failedNotification4AjaxRequest(xhr, textStatus);
      $$('.dice').removeClass('shake-animation');
      reject("Failed to retrieve random message");
    });
}

