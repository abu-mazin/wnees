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

$$('[data-elm="guest-name"]').on('input', function () {
  var input = $$(this).val().replace(/\s/g, ''); // Remove spaces
  if (input.length >= 3) {
    $$('.modal-button').removeClass('disabled'); // Enable the OK button
  } else {
    $$('.modal-button').addClass('disabled'); // Disable the OK button
  }
});

$$('.signInFormLink').on('click', function (e) {
  e.preventDefault();

  // close popups
  myApp.closeModal('.popup-login');
  myApp.closeModal('.login-screen');
});

$$('.signUpForm-to-json').on('click', function (e) {
  e.preventDefault();
  var SignUPForm_parms = myApp.formToJSON('#signUpForm');
  SignUPForm_parms.name = user.name;
  delete SignUPForm_parms.terms;
  $$.doAJAX('users/register', SignUPForm_parms, 'POST', false,
    // Success (200)
    function (r, textStatus, xhr) {
      console.log(r)
      initUserLoggedIn();
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

if (typeof getThis("logedinUser") !== "undefined" && getThis("logedinUser") == 1) {
  initUserLoggedIn();
}

function isGuest() {
  if (getThis('hideWelcomeScreen') == '1' && userGUID === undefined) {
    let data = JSON.parse(getThis("userData"));
    if (!data) {
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
                $$.doAJAX('users-info', { name: userName }, 'POST', true,
                  // Success (200)
                  function (r, textStatus, xhr) {
                    if (typeof r != 'undefined' && r != null) {
                      userGUID = r.GUID;
                      let data = { user: { user_info: {} } }
                      data.user.user_info.name = r.name;
                      data.user.user_info.profile_picture = r.profile_picture;
                      data.user.user_info.settings = r.settings;
                      data.user.user_info.GUID = r.GUID;
                      setThis("userData", JSON.stringify(data));
                      initUserLoggedIn(1);
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
    } else {
      initUserLoggedIn(1)
    }
  }
}

function initUserLoggedIn(guest = 0) {
  user = new User(JSON.parse(getThis("userData")));
  userGUID = user.guid;
  handleRandomPublicMessage();
  $$('*[data-elm="user-name"]').text(user.name);
  $$('*[data-elm="user-name"]').val(user.name);

  if (user.profilePicture) {
    $$('[data-elm="user-image"]').attr('src', imagePath + user.profilePicture);
  } else {
    $$('[data-elm="user-image"]').attr('src', 'img/user-pic.svg');
  }
  if (guest === 0) {
    userLogedin = true;
    $$('.navbar-user-name').hide();
    $$('.logout').show();
  }
}

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
  userGUID = undefined;
  setThis("hideWelcomeScreen", 1);
  $$('[data-elm="user-image"]').attr('src', 'img/user-pic.svg');
  $$('*[data-elm="user-name"]').empty();
  $$('*[data-elm="user-name"]').val('');
  $$('.navbar-user-name').show();
  $$('.logout').hide();

  isGuest();
}

function handleRandomPublicMessage() {
  return new Promise((resolve, reject) => {
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
  });
}

isGuest();
var currentStep = 1;
var totalSteps = 3;

// Show the first step when the start button is clicked
$$('#startBtn').on('click', function () {
  showStep(1);
  $$('#nextBtn').css('display', 'flex');  // Show the next button
  $$(this).css('display', 'none');         // Hide the start button
  scrollToStep(1);                         // Scroll to the first step
});

// Handle the next button click
$$('#nextBtn').on('click', function () {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);  // Show the next step while keeping previous steps visible
    scrollToStep(currentStep);  // Scroll to the newly shown step
  }
  // Hide the Next button after the last step
  if (currentStep === totalSteps) {
    $$('#nextBtn').css('display', 'none');
    $$('[data-elm="received-messages-btn"]').css('display','flex')
  }
});

// Function to show the desired step while keeping previous steps visible
function showStep(stepNumber) {
  // Show the current step with animation
  $$('#step' + stepNumber).addClass('show');
}

// Function to scroll to the current step
function scrollToStep(stepNumber) {
  var stepElement = $$('#step' + stepNumber)[0]; // Get the DOM element for the step
  stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the element
}


// Function to show the desired step while keeping previous steps visible
function showStep(stepNumber) {
  // Show the current step with animation
  $$('#step' + stepNumber).addClass('show');
}

$$('.dice').on('click', function () {
  $$(this).addClass('shake-animation');
  handleRandomPublicMessage();
});

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
    console.log('YES')
  }

  console.log(JSON.stringify(formData))
  // Proceed with AJAX request to send the FormData
  $$.doAJAX('users-info', formData, 'POST', true,
    // Success (200)
    function (r, textStatus, xhr) {
      console.log(r)
      $$('*[data-elm="user-name"]').text(r.name);
      $$('*[data-elm="user-name"]').val(r.name);
      if (r.profile_picture) {
        $$('[data-elm="user-image"]').attr('src', imagePath + r.profile_picture);
      }

      let data = JSON.parse(getThis("userData"));
      data.user.user_info.name = r.name;
      user.name = r.name;
      data.user.user_info.profile_picture = r.profile_picture;
      user.profilePicture = r.profile_picture;
      setThis("userData", JSON.stringify(data));
      myApp.closeModal('.popup-settings');

    },
    // Failed
    function (xhr, textStatus) {
      // Failed notification
      failedNotification4AjaxRequest(xhr, textStatus);
    });
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
      console.log(r)
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

$$.doAJAX('available-responses', {}, 'GET', false,
  // Success (200)
  function (r, textStatus, xhr) {
    console.log(r)
    console.log(r.length)
    if (r.length == 0) {
      $$('[data-elm="available-responses"]').append(`
        <span>تنبيه لا يوحد ردود...</span>
      `);
    } else {
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


$$('.logout').on('click', function () {
  initUserLogedout();
})