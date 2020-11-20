function validateLogin()
{
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  document.getElementById("formErr").innerHTML = '';

  if(isValidLogin(username, password))
  {
    $.post("processLogin", 
    {
      username : username,
      password : password
    }, 
    function(data, status){
      if(data.success)
      {
        window.location.replace("./home");
      }
      else
      {
        document.getElementById("formErr").innerHTML = "Username or password is invalid";
      }
    });
    return false
  }
  else
  {
    return false;
  }
}


function isValidLogin(username, password)
{
  var valid = true;
  var usernameErr = document.getElementById("usrnmErr");
  var passErr = document.getElementById("passwdErr");
  var pattern1 = RegExp('^[0-9A-z]+$');
  var pattern2 = RegExp('^ +$');

  usernameErr.innerHTML = '';
  passErr.innerHTML = '';

  if(!pattern1.test(password))
  {
    passErr.innerHTML = "Password must only contian letters and numbers";
    valid = false;
  }

  if(pattern2.test(password) || password == '')
  {
    passErr.innerHTML = "Password cannot be blank";
    valid = false;
  }

  if(!pattern1.test(username))
  {
    usernameErr.innerHTML = "Username must only contain letters and numbers."
    valid = false;
  }

  if(pattern2.test(username) || username == '')
  {
    usernameErr.innerHTML = "Username cannot be blank."
    valid = false;
  }

  return valid;
}

function validateRegister()
{
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var confPassword = document.getElementById("confPassword").value;
  if(isValidRegister(fname, lname, username, password, confPassword))
  {
    $.post("processRegister", 
    {
      fname : fname,
      lname : lname,
      username : username,
      password : password
    }, 
    function(data, status){
      if(data.success)
      {
        window.location.replace("./login");
      }
      else
      {
        document.getElementById("formErr").innerHTML = "Username is already in use!";
      }
    });
    return false
  }
  else
  {
    return false;
  }
}


function isValidRegister(fname, lname, username, password, confPassword)
{
  var valid = true;
  var usernameErr = document.getElementById("usrnmErr");
  var passErr = document.getElementById("passwdErr");
  var fnameErr = document.getElementById("fnameErr");
  var lnameErr = document.getElementById("lnameErr");
  var confPassErr = document.getElementById("confPasswdErr");
  var pattern1 = RegExp('^[0-9A-z]+$');
  var pattern2 = RegExp('^ +$');

  var passTest = RegExp('^.{7,}$');
  var passTest2 = RegExp('[0-9]+');

  usernameErr.innerHTML = '';
  passErr.innerHTML = '';
  confPassErr.innerHTML = "";
  fnameErr.innerHTML = "";

  if(!pattern1.test(password))
  {
    passErr.innerHTML = "Password must only contian letters and numbers";
    valid = false;
  }

  if(pattern2.test(password) || password == '')
  {
    passErr.innerHTML = "Password cannot be blank";
    valid = false;
  }

  if(confPassword != password)
  {
    valid = false;
    confPassErr.innerHTML = "Passwords must match";
  }

  if(!pattern1.test(fname))
  {
    valid = false;
    fnameErr.innerHTML = "First name must only contian letters"
  }

  if(pattern2.test(fname) || fname == '')
  {
    valid = false;
    fnameErr.innerHTML = "First name cannot be blank";
  }

  if(!pattern1.test(lname))
  {
    valid = false;
    lnameErr.innerHTML = "Last name must only contian letters"
  }

  if(pattern2.test(lname) || lname == '')
  {
    valid = false;
    lnameErr.innerHTML = "Last name cannot be blank";
  }

  if(!pattern1.test(username))
  {
    usernameErr.innerHTML = "Username must only contain letters and numbers."
    valid = false;
  }

  if(pattern2.test(username) || username == '')
  {
    usernameErr.innerHTML = "Username cannot be blank."
    valid = false;
  }

  if(!passTest.test(password) || !passTest2.test(password))
  {
    passErr.innerHTML = "Password must be at least 7 characters long and contain a number.";
    valid = false;
  }

  return valid;
}