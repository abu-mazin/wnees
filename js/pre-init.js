/* 'use strict'; */
// Wait for device API libraries to load
document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);
// Cordova is loaded and it is now safe to make calls Cordova methods, device APIs are available
function onDeviceReady() {
  //deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "Other";
  deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : "Other";

  if ( deviceType == "Android" ) {
    //         "onesignal-cordova-plugin": "3.3.3",
    setTimeout(function () {
      if(isNotificationEnabled == true) {
        window.plugins.OneSignal.setAppId(notificationID),

        //Prompts the user for notification permissions.
        //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
        window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) { });

        try {
            window["plugins"].OneSignal.addSubscriptionObserver(function (state) { 
                if (!state.from.subscribed && state.to.subscribed) { 
                    if(typeof OneSignalIDs == 'undefined' || OneSignalIDs == null || OneSignalIDs == ""){
                    OneSignalIDs = state.to.userId;
                    }
                } 
            });
        } catch (error) {
            // alert(error.message);
        }

        try {
            window.plugins.OneSignal.getDeviceState((state) => {
                if(typeof OneSignalIDs == 'undefined' || OneSignalIDs == null || OneSignalIDs == ""){
                OneSignalIDs = state.userId;
                }
            });
        } catch (error) {
            // alert(error.message);
        }

        try {
            window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
                if(typeof OneSignalIDs == 'undefined' || OneSignalIDs == null || OneSignalIDs == ""){
                OneSignalIDs = status.subscriptionStatus.userId;
                }
            });
        } catch (error) {
            // alert(error.message);
        }
        
        try {
            window.plugins.OneSignal.getIds(function(ids) {
                if(typeof OneSignalIDs == 'undefined' || OneSignalIDs == null || OneSignalIDs == ""){
                    OneSignalIDs = ids.userId;
                }
            });
        } catch (error) {
            // alert(error.message);
        }

        try {
          window.plugins.OneSignal.setNotificationOpenedHandler(function(jsonData) {
            if (getThis("userLogedin") == 1 || getThis("randomUserLogedin") == 1) {
              getSentMessages(false);
              getReceivedMessages(false);
            }
          });
        } catch (error) {
            // alert(error.message);
        }
      }
    }, 4000);
  } else {
    // used for push notifcations
    setTimeout(function () {
      if(isNotificationEnabled == true) {
        // Set your iOS Settings
        var iosSettings = {};
        iosSettings["kOSSettingsKeyAutoPrompt"] = false;
        iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
        window.plugins.OneSignal
          .startInit(notificationID)
          // .handleNotificationOpened(notificationOpenedCallback)
          .iOSSettings(iosSettings)
          .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
          .endInit();
        // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
        window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          //console.log("User accepted notifications: " + accepted);
        });
        window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
          //status.permissionStatus.hasPrompted; // Bool
          //status.permissionStatus.status; // iOS only: Integer: 0 = Not Determined, 1 = Denied, 2 = Authorized
          //status.permissionStatus.state; //Android only: Integer: 1 = Authorized, 2 = Denied

          //status.subscriptionStatus.subscribed; // Bool
          //status.subscriptionStatus.userSubscriptionSetting; // Bool
          if(typeof OneSignalIDs == 'undefined' || OneSignalIDs == null || OneSignalIDs == ""){
          OneSignalIDs = status.subscriptionStatus.userId; // String: OneSignal Player ID
          }
          //status.subscriptionStatus.pushToken; // String: Device Identifier from FCM/APNs
        });
        window.plugins.OneSignal.getIds(function(ids) {
          if(typeof OneSignalIDs == 'undefined' || OneSignalIDs == null || OneSignalIDs == ""){
            OneSignalIDs = ids.userId;
          }
        });
        window.plugins.OneSignal.setNotificationOpenedHandler(function(jsonData) {
          if (getThis("userLogedin") == 1 || getThis("randomUserLogedin") == 1) {
            getSentMessages();
            getReceivedMessages();
          }
        });
        //END ONESIGNAL CODE
      }
    }, 4000);
  }
}

// Handle the online event
function onOnline() {
}

// Handle the offline event
function onOffline() {
  // show no connection alert
  //myApp.addNotification({ hold: 3000, title: 'No connection!', message: 'Faild to connect to internet!' });
	myApp.addNotification({ hold: 3000, title: 'فشل الأتصال', message: 'لا يوجد اتصال! (رقم 5151)' });
}

// Handle the back button event on Android
function onBackKeyDown() {
	// Handle the back button
  if (($$('#leftpanel').hasClass('active')) || ($$('#rightpanel').hasClass('active'))) { // #leftpanel and #rightpanel are id of both panels.
    myApp.closePanel();
    return false;
  } else if ($$('.modal-in').length > 0) {
    myApp.closeModal();
    return false;
  } else if ($$('.photo-browser').length > 0) {
    photoBrowserLight.close();
    return false;
  } else {
		if(currentTab == 'main_tab') {
			var currentPage = mainView.activePage.name;
			if (currentPage == 'index') {
        myApp.confirm('هل تريد الخروج من التطبيق؟', function() {
          // if(deviceType == “Android” || deviceType == “android”){
          navigator.app.exitApp();
          // }
				},
				function() {
				});
			}
			mainView.router.back();
		} else if(currentTab == 'diet_tab') {
			dietView.router.back();
		} else if(currentTab == 'exercises_tab') {
			exercisesView.router.back();
		} else if(currentTab == 'challenges_tab') {
			challengesView.router.back();
			//challengesView.router.back({pageName:'more'});
		}
  }
}
