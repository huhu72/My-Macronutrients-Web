var state = false;
var checked = false;
var welcome = document.getElementById("welcome");
var password, email, name, confirm_password, user, userID,gender;
var database = firebase.database();

const auth = firebase.auth();

function setCookie(name, value) {
  var date = new Date();
  var l = ";samesite=strict";
  date.setTime(date.getTime() + ( 24 * 60 * 60 * 1000));
  document.cookie = 
    name + "=" + value + ";" + "expires=" + date.toUTCString() + l+ ";path=/"
  ;
}

function getCookie(cookieName) {
  cookieName += "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(";");
  console.log(cookieName);
  console.log(cookieArray);
  console.log(cookieArray[0].indexOf(cookieName));
  for (var i = 0; i < cookieArray.length; i++) {
    var cookiePair = cookieArray[i];
    while (cookiePair.charAt(0) == " ") {
      cookiePair = cookiePair.substring(1);
    }
    if (cookiePair.indexOf(cookieName) == 0) {
      return cookiePair.substring(cookieName.length, cookiePair.length);
    }
  }
  return "";
}
function deleteCookie(){
  document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
//Start of log in function
function signup() {
  const gender = document.querySelectorAll('input[name="gender"]');
  email = document.getElementById("email").value;
  name = document.getElementById("name").value;
  confirmPass = document.getElementById("signup-cpwd").value;
  password = document.getElementById("signup-pwd").value;
  var selectedVal;

  for (const radioBtn of gender) {
    if (radioBtn.checked) {
      selectedVal = radioBtn.value;
      checked = true;
    }
  }
  if (!checked) {
    $(".gender-radio").css("border", ".1px solid red");
    alert("Please choose a gender");
    return;
  }
  if (name.length == 0) {
    alert("Please put in your name");
    return;
  }
  if (email.length < 4) {
    alert("Please enter an email address.");
    return;
  }
  if (password.length < 4) {
    alert("Please enter a password.");
    return;
  }
  if (confirmPass != password) {
    alert("Please make sure your passwords match");
    return;
  }

  //Signs up user with email and password
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == "auth/weak-password") {
        alert("The password is too weak.");
        return;
      } else {
        alert(errorMessage);
      }
      console.log(error);
      //End signup
    });
  setCookie("email", email);
  setCookie("password",password);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("logged In");

      auth.currentUser
        .updateProfile({
          displayName: name,
        })
        .then(function () {
          database.ref("Users/" + auth.currentUser.uid).set({
            Name: name,
            Email: email,
            Password: password,
            Gender: selectedVal,
          });
          welcome.innerHTML = "Welcome " + user.displayName;
          $("#signup-btn").css("display", "none");
          $("#login-btn").css("display", "none");
        });
    }
  });
}
//Logs in user and make changes to the page
function login() {
  //User is signed in
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
  //logs in the user
  else {
    window.email = document.getElementById("login-email").value;
    window.password = document.getElementById("login-pwd").value;
    if (email.length < 4 || password.length < 4) {
      alert("Please enter a valid log in information");
      return;
    }
    firebaseSignIn(email, password);
    setCookie("email",email);
    setCookie("password",password);
  }
}

function firebaseSignIn(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
        $(".loading").css("display", "none");
        return;
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
}
function logout() {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        location.reload();
        console.log("Signed Out");
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
    );
    deleteCookie();
}
function nav() {
  var menu = document.querySelector("ul");
  menu.classList.toggle("active");
}
function passCount(obj) {
  var password_counter = document.getElementById("password-counter");
  this.password = obj.value;

  if (obj.value.length < 6) {
    password_counter.innerHTML = obj.value.length + "/6";
    $("#signup-pwd-wrapper").css("border-bottom", " .8px solid red");
  } else {
    password_counter.innerHTML = "";
    $("#signup-pwd-wrapper").css("border-bottom", " .8px solid #707070");
  }
}
function confirmCount(obj) {
  var confirm_password_counter = document.getElementById(
    "confirm-password-counter"
  );
  if (obj.value.length < 6) {
    confirm_password_counter.innerHTML = obj.value.length + "/6";
    $("#confirm-signup-pwd-wrapper").css("border-bottom", " .8px solid red");
  } else if (obj.value != this.password) {
    confirm_password_counter.innerHTML = "Passwords do not match";
    $("#confirm-signup-pwd-wrapper").css("border-bottom", " .8px solid red");
    $("#confirm-password-counter").css("color", "red");
  } else {
    confirm_password_counter.innerHTML = "";
    $("#confirm-signup-pwd-wrapper").css(
      "border-bottom",
      " .8px solid #707070"
    );
  }
}
function nameCount(obj) {
  this.name = obj.value;
  if (obj.value.length < 1) {
    $("#name").css("border-bottom", " .8px solid red");
  } else {
    $("#name").css("border-bottom", " .8px solid #707070");
  }
}
function emailCount(obj) {
  var name = document.getElementById("name").value;
  this.email = obj.value;
  if (obj.value.length < 5) {
    $("#email").css("border-bottom", " .8px solid red");
  } else {
    $("#email").css("border-bottom", " .8px solid #707070");
  }
  if (name.length == 0) {
    $("#name").css("border-bottom", " .8px solid red");
  }
}
function openPopup(obj) {
  $(obj).css("display", "grid");
}

function closePopup(obj) {
  $(obj).css("display", "none");
}
function toggle() {
  if (state) {
    document.getElementById("login-pwd").type = "password";
    document.getElementById("signup-pwd").type = "password";
    document.getElementById("signup-cpwd").type = "password";
    $(".fas").removeClass("fa-eye").addClass("fa-eye-slash");
    state = false;
  } else {
    document.getElementById("login-pwd").type = "text";
    document.getElementById("signup-pwd").type = "text";
    document.getElementById("signup-cpwd").type = "text";
    $(".fas").removeClass("fa-eye-slash").addClass("fa-eye");
    state = true;
  }
}

function initApp() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      
      window.user = user;
      window.userID = user.uid;
      welcome.innerHTML = "Welcome " + user.displayName;
      $("#signup-btn").css("display", "none");
      $("#login-btn").css("display", "none");
      $(".login").css("display", "none");
      $(".signup").css("display", "none");
      $("#logout").css("display", "block");
      gender();
      
    } else {
      $(".loading").css("display", "none");
    }
  });
}
function gender() {
  var genderDBReference = firebase
    .database()
    .ref("Users/" + userID + "/Gender");
  genderDBReference
    .once("value", function (snap) {
      userGender = snap.val();
    })
    .then(function () {
      if (userGender == "Male") {
        $("#avatar").css("background-image", "url(/images/male.svg)");
      } else {
        $("#avatar").css("background-image", "url(/images/female.svg)");
      }
      $(".loading").css("display", "none");
     
    });
}
window.onload = function () {
  $(".loading").css("display", "grid");
  initApp();
  
  
};
