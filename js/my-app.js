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
  $$('*[data-elm="user-name"]').text(user.name)
}

if (getThis('hideWelcomeScreen') == '1' && userLogedin != true) {
  console.log("YE",getThis('hideWelcomeScreen') == '1',userLogedin != true)
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