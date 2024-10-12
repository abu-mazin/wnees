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
