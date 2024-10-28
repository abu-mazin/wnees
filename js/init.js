// Expose Internal DOM library
var $$ = Dom7;
// Initialize app
var myApp = new Framework7({
  swipePanel: 'left',
  swipePanelActiveArea: 70,
  showBarsOnPageScrollEnd: false,
  modalTitle: '',
  modalButtonOk: OkButton,
  modalButtonCancel: CancelButton,
  modalButtonYes: YesButton,
  modalButtonNo: NoButton,
});

// init main view
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true,
  domCache: true,
});

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
