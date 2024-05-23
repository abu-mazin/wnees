/* 'use strict'; */
// Wait for device API libraries to load
document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);
// Cordova is loaded and it is now safe to make calls Cordova methods, device APIs are available
function onDeviceReady() {
  deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "Other";

  /*
  if ( deviceType == "Android" ) {
    DB = window.sqlitePlugin.openDatabase({ name: 'soraate.db', location: 'default', androidDatabaseProvider: 'system' });
  } else {
    DB = window.sqlitePlugin.openDatabase({ name: 'soraate.db', location: 'default' });
  }
  DB.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS DB_data (json_result)');
    tx.executeSql('SELECT json_result FROM DB_data', [], function (tx, rs) {
      if (rs.rows.length > 0) {
        if (rs.rows.item(0).json_result != "")
          DB_data = JSON.parse(rs.rows.item(0).json_result);
      } else {
        tx.executeSql('INSERT INTO DB_data VALUES (?)', ['{}']);
      }
      useDB = true;
    }, function (tx, error) {
      //console.log('SELECT error: ' + error.message);
      useDB = false;
    });
  }, function (error) {
    //console.log('Transaction ERROR: ' + error.message);
    useDB = false;
  }, function() {
    //console.log('Transaction ok');
  });

  // healthkit for iOS
  cordova.plugins.health.isAvailable(
    function(){
      //
      cordova.plugins.health.isAuthorized(
                                            {
                                              read : ['steps'],            // Read permission
                                            },
                                            function(){
                                              alert('authorized');
                                            },
                                            function(){
                                              alert('not authorized');
                                            }
                                          );

      //
      cordova.plugins.health.queryAggregated(
                                              {
                                                startDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // three days ago
                                                endDate: new Date(), // now
                                                dataType: 'steps',
                                                filterOutUserInput: true,
                                                ascending: false,
                                                bucket: 'day'
                                              },
                                              function(e){
                                                alert(JSON.stringify(e));
                                                alert(JSON.stringify(e[0].endDate));
                                                $$(`*[data-elm="steps-target"]`).text(e[0].value)
                                              },
                                              function(error){
                                                alert('Error2: '+error);
                                              }
                                            );
    },
    function(error){
        alert('Error1: '+error);
    }
  );
  */
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
        myApp.confirm('هل تريد الخروج من التطبيق?', function() {
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
