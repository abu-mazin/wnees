// https://phrase.com/blog/posts/step-step-guide-javascript-localization/
// add

// The active locale
const locale ="";

// We can have as many locales here as we want,
// and use any locales we want. We have English
// and Arabic as locales here as examples.
const translations = {
  // English translations (to facilitate the development and communication process only)
  "en": {
    // Common Words
    "ar":"in Arabic",
    "en": "in English",
    "pls":"please",

    // Common Words for alerts
    [OkButton]: "OK",
    [CancelButton]: "Cancel",
    [YesButton]: "Yes",
    [NoButton]: "No",

    // Days & Months Names
    'dayNamesShort0': 'Sun',
    'dayNamesShort1': 'Mon',
    'dayNamesShort2': 'Tue',
    'dayNamesShort3': 'Wed',
    'dayNamesShort4': 'Thu',
    'dayNamesShort5': 'Fri',
    'dayNamesShort6': 'Sat',
    'dayNames0': 'Sunday',
    'dayNames1': 'Monday',
    'dayNames2': 'Tuesday',
    'dayNames3': 'Wednesday',
    'dayNames4': 'Thursday',
    'dayNames5': 'Friday',
    'dayNames6': 'Saturday',
    'monthNames0': 'January',
    'monthNames1': 'February',
    'monthNames2': 'March',
    'monthNames3': 'April',
    'monthNames4': 'May',
    'monthNames5': 'June',
    'monthNames6': 'July',
    'monthNames7': 'August',
    'monthNames8': 'September',
    'monthNames9': 'October',
    'monthNames10': 'November',
    'monthNames11': 'December',

    //Welcome Screens
    
    // Signin
    "signin": "Sign In",
    "signin-desc": "We are delighted to see you again! Wish you an enjoyable experience",
    "forget_password": "Forget password ?",
    "dont_have_account": "Don't have account ?",
    "create_new_account": "create a new account",

    // Forget Password
    "do_you_forget_password": "Do you forget password ?",
    "forget_password_desc": "Please enter your email address to retrieve your password",
    "send": "Send",
    "enter_verification_code": "Enter the verification code",
    "we_sent_code": "We have sent a verification code to your email",
    "confirm": "Confirm",
    "resend": "Resend",
    "create_new_password": "Create a new password",
    "different_passowrd": "The new password must be different from the previous password",

    // inputs
    "البريد الإلكتروني *": "Email *",
    "كلمة المرور *": "Password *",
    "كلمة المرور": "Password",
    "بحث": "Search",
  },

  // Arabic translations (not needed)
  /*
  "ar": {
    "today": "اليوم",
  },
  */
};

// VARS
if (locale === "en") {
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  CopyButton = 'Copy';
  EditButton = 'Edit';
  DeleteButton = 'Delete';
}

// start translation
if (locale !== "") {
  // Welcome Screens
  $$(".next-slide").on("click", function() {
    var $swiperWrapper = $$(this).closest(".swiper-wrapper");
    var currentTransform = $swiperWrapper[0].style.transform;

    // Parse the current transform value to extract the X translation
    var match = currentTransform.match(/translate3d\((-?\d+)px, 0px, 0px\)/);
    var currentXTranslation = match ? parseInt(match[1]) : 0;

    var newTransformValue = "translate3d(" + -(currentXTranslation) + "px, 0px, 0px)";
    $swiperWrapper[0].style.transform = newTransformValue;
    $swiperWrapper[0].style.transitionDuration = "0.6s";
  });

  $$('html').css('direction','ltr');
  $$('#main_tab .navbar-inner').css('flex-direction','row-reverse');
  $$('i.fa.fa-chevron-right').removeClass('fa-chevron-right').addClass('fa-chevron-left');
  $$('.navbar .right').css('margin-right', '0');
  $$('.navbar .left').css('margin-left', '0');
  $$('.swiper-wrapper .swiper-slide.item:first-of-type').css('margin-left', '0');
  $$('.swiper-wrapper').css('transform', 'translate3d(0 , 0  , 0)');
  $$('.center.sliding').removeAttr('style');
  
  // When the page content is ready...
  document.addEventListener("DOMContentLoaded", () => {
    // Find all elements that have the key attribute
    $$("[data-i18n-key]").forEach(translateElement);
    // Find all inputs that have the key attribute
    $$("input[placeholder]").forEach(translateInput);
  });

  // when other pages are initiated:
  $$(document).on('page:init', function (e) {
    // Page Data contains all required information about loaded and initialized page
    var page = e.detail.page;
    document
      .querySelectorAll("[data-page=" + page.name + "].view .navbar [data-i18n-key]")
      .forEach(translateElement);
    document
      .querySelectorAll("[data-page=" + page.name + "].page [data-i18n-key]")
      .forEach(translateElement);
  });

  // translate alerts when fire
  $$(document).on('modal:open', function (e) {
    this
      .querySelectorAll("[data-i18n-key]")
      .forEach(translateElement);
  });

  // Replace the inner text of the given HTML element
  // with the translation in the active locale,
  // corresponding to the element's data-i18n-key
  function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const words = key.split("_");
    const translation = words.map(word => translations[locale][word] || word).join(" ");
    element.innerText = translation;
  }

  // translate inputs
  function translateInput(element) {
    const key = element.getAttribute("placeholder");
    const translation = translations[locale][key];
    element.setAttribute('placeholder', translation);
  }
}

// 
myApp.onPageInit('*', function (page) {
  if (locale !== "") {
    $$('i.fa.fa-chevron-right').removeClass('fa-chevron-right').addClass('fa-chevron-left');
    $$('.navbar .right').css('margin-right', '0');
    $$('.navbar .left').css('margin-left', '0');
    $$('.money-box input').css({
      'border-top-left-radius': '10px',
      'border-bottom-left-radius': '10px',
      'border-top-right-radius': '0',
      'border-bottom-right-radius': '0',
    });
    $$('.money-box .currency').css({
      'border-top-left-radius': '0',
      'border-bottom-left-radius': '0',
      'border-top-right-radius': '10px',
      'border-bottom-right-radius': '10px',
    })
    $$('[data-page="user-permissions"] .dropdown-content').css("width","250px")
    $$('.dropdown-content .dropdown-option').css("display","block");
    $$(".list-block .sortable-handler.sortable-handler-ltr").css({
      "left": "auto",
      "right": "0",
    });
    $$('.center').removeAttr('style');
    $$(".list-block .item-link .item-inner").css({
      // 'background-image': 'url("' + svgCode + '")',
      'background-position': 'right 15px top 15px',
      'padding-right':'35px',
      'padding-left': '0',
    });
    $$(".label-switch .checkbox").css("transform","rotate(180deg)")
    var styleElement = $$('<style>');
    styleElement.text(".label-switch .checkbox::after { box-shadow: 0 -2px 5px rgba(0,0,0,0.4); }");
    $$('head').append(styleElement);
    $$(".swiper-wrapper").css("transform","translate3d(-375px, 0px, 0px)");
    $$(".step-status").css({
      "right":"10px",
      "left":"auto",
    });
    $$(".picker-calendar .calendar-custom-toolbar .right").css("transform","rotate(180deg)")
    $$(".picker-calendar .calendar-custom-toolbar .left").css("transform","rotate(180deg)")
    $$('.swiper-wrapper').css('transform', 'translate3d(0 , 0  , 0)');
  }
})
