// ======================================
// COMMON VARS
// ======================================
// get current date
var curr = new Date();

// ======================================
// API URLS
// ======================================
// images path
var APIurl = 'https://wnees.com/api/';
var imagePath = 'https://wnees.com/storage/';

// ======================================
// INIT VARS
// ======================================
// app version
var thisVersion = '1.0.0';
// user device Type
var	deviceType;
// local DB
var DB = null;
// use local DB
var useDB = false;
// data as array, retrived from API and local DB
var DB_data;
// current tab that user is on
var currentTab = 'main_tab';

// ======================================
// USER VARS
// ======================================
var userLogedin = false;
var userGUID ;
var user;

// ======================================
// APP VARS
// ======================================
var msgParms = {};
var sentMessages = [];
var receivedMessages = [];

// ======================================
// LANGS VARS
// ======================================
var monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
var dayNamesShort = ['أ', 'أث', 'ث', 'أر', 'خ', 'ج', 'س'];
// Lang vars - Arabic Words used inside action modal
var CopyButton = 'نسخ';
var EditButton = 'تعديل';
var DeleteButton = 'حذف';
// Arabic Words used inside Initialize app
var OkButton = 'حسناً';
var CancelButton = 'إلغاء';
var YesButton = 'نعم';
var NoButton = 'لا';
