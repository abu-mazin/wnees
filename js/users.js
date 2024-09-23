class User {
  // user main attributes
  token;

  name;
  username;
  email;
  userguid;
  profilePicture;
  settings;



  constructor(parms) {
    // user main attributes
    this.token = parms.access_token;
    this.username = parms.user.username;
    this.email = parms.user.email;
    this.name = parms.user.user_info.name; // Correct variable name
  }


  // USER & VALIDATION methods -----------------------------
  static validEmail(value) {
    var emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!value.match(emailRegEx)) {
      return false;
    }
    return true;
  }

  static validUsername(value) {
    var usernameRegEx = /^([a-zA-Z0-9_]{2,25})$/;
    if (!value.match(usernameRegEx)) {
      return false;
    }
    return true;
  }

  static validPassword(value) {
    // Password must be 6 characters or longer and contain at least one symbol, one number, one lowercase letter, and one uppercase letter
    //var passwordRegEx = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    //if(!value.match(passwordRegEx)) {
    if (value.length < 6) {
      return false;
    }
    return true;
  }

  static calculateAge(birthdate) {
    if(birthdate != null) {
      // Convert the birthdate string to a Date object
      let tokens = birthdate.split(/[-: ]/g)
      const birthdateDate = new Date(tokens[0], parseInt(tokens[1]) -1, tokens[2]);
      //const birthdateDate = new Date(birthdate);

      // Get the current date
      const currentDate = new Date();

      // Calculate the age
      const age = currentDate.getFullYear() - birthdateDate.getFullYear() -
        (currentDate.getMonth() < birthdateDate.getMonth() ||
          (currentDate.getMonth() === birthdateDate.getMonth() &&
            currentDate.getDate() < birthdateDate.getDate()) ? 1 : 0);

      return age;
    }
    return this.defaultAge;
  }

  updateEmail() {
    if (validEmail(value)) {
      // change data on server
      // and on device localstorage
      // then update it here...
      this.email = value;
      return true;
    } else {
      return false;
    }
  }

  updateUsername(value) {
    this.username = value;
    if (validUsername(value)) {
      // change data on server
      // and on device localstorage
      // then update it here...
      this.username = value;
      return true;
    } else {
      return false;
    }
  }


  
}
