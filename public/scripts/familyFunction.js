$(document).ready(function() {
  genFamForm();
});

function genJoinFamForm()
{
  var container = document.getElementById('famBox');

  var form = "<h3>Join a family:</h3>\n<span id='formErr'></span>\n"
  form += "<form class='authForm' method='POST' action='' onsubmit='return processJoinFam()'>\n";
  form += "<label for='famName'>Family Name:</label>\n";
  form += "<input type='text' id='famName' name='famName'>\n"; 
  form += "<label for='famCode'>Family Join Code:</label>\n";
  form += "<input type='text' id='famCode' name='famCode'><br>\n";
  form += "<button type='submit' class='btn btn-success'>Submit</button>\n";
  form += "</form><br>\n";
  form += "<button class='btn btn-danger' onclick='genFamForm()'>Back</button>";
  container.innerHTML = form;
}

function genCreateFamForm()
{
  var container = document.getElementById('famBox');

  var form = "<h3>Create a family:</h3>\n<span id='formErr'></span>\n"
  form += "<form class='authForm' method='POST' action='' onsubmit='return processCreateFam()'>\n"; 
  form += "<label for='famName'>Family Name:</label>\n";
  form += "<input type='text' id='famName' name='famName'>\n";
  form += "<label for='famCode'>Family Join Code:</label>\n";
  form += "<input type='text' id='famCode' name='famCode'><br>\n";
  form += "<button type='submit' class='btn btn-success'>Submit</button>\n";
  form += "</form>\n";
  form += "<button class='btn btn-danger' onclick='genFamForm()'>Back</button>";
  container.innerHTML = form;
}

function genFamForm()
{
  var container = document.getElementById('famBox');

  var form = "<h3>It looks like you are not part of a family yet! <br>You can:</h3>\n"; 
  form += "<span id='formErr'></span>\n";
  form += "<button type='button' class='btn btn-primary' onclick='genCreateFamForm()'>Create a family</button>\n";
  form += "<h3>Or</h3>\n";
  form += "<button type='button' class='btn btn-success' onclick='genJoinFamForm()'>Join a Family</button>\n";
  container.innerHTML = form;
}

function processCreateFam()
{
  var famName = document.getElementById("famName").value;
  var famCode = document.getElementById("famCode").value;
  if(isValidCreateFam(famName, famCode))
  {
    $.post("processCreateFam", 
    {
      famName : famName,
      famCode : famCode
    }, 
    function(data, status){
      if(data.success)
      {
        window.location.replace("./home");
      }
      else
      {
        document.getElementById("formErr").innerHTML = "Oops! Something happened. Try again later!";
      }
    });
    return false
  }
  else
  {
    return false;
  }
}


function genFamForm()
{
  var container = document.getElementById('famBox');

  var form = "<h3>It looks like you are not part of a family yet! <br>You can:</h3>\n"; 
  form += "<span id='formErr'></span>\n";
  form += "<button type='button' class='btn btn-primary' onclick='genCreateFamForm()'>Create a family</button>\n";
  form += "<h3>Or</h3>\n";
  form += "<button type='button' class='btn btn-success' onclick='genJoinFamForm()'>Join a Family</button>\n";
  container.innerHTML = form;
}

function processJoinFam()
{
  var famName = document.getElementById("famName").value;
  var famCode = document.getElementById("famCode").value;
  if(isValidJoinFam(famName, famCode))
  {
    $.post("processJoinFam", 
    {
      famName : famName,
      famCode : famCode
    }, 
    function(data, status){
      if(data.success)
      {
        window.location.replace("./home");
      }
      else
      {
        document.getElementById("formErr").innerHTML = "Incorrect Family name or code.";
      }
    });
    return false
  }
  else
  {
    return false;
  }
}

function isValidCreateFam(famName, famCode)
{
  valid = true;
  var pattern1 = RegExp('^[0-9 A-z]+$');
  var pattern2 = RegExp('^ +$');
  var passTest = RegExp('^.{7,}$');
  var passTest2 = RegExp('[0-9]+');

  formErr = document.getElementById('formErr');
  formErr.innerHTML = '';

  if(!pattern1.test(famName))
  {
    formErr.innerHTML += "Family name must only contian letters, spaces, and numbers\n";
    valid = false;
  }

  if(pattern2.test(famName))
  {
    formErr.innerHTML += "Family name must not be blank.\n";
    valid = false;
  }

  if(!pattern1.test(famCode))
  {
    formErr.innerHTML += "Family Code must only contain letters, spaces and numbers.\n";
    valid = false;
  }

  if(!passTest.test(famCode) || !passTest2.test(famCode))
  {
    formErr.innerHTML += "Family code must include at least 7 characters and a number.\n";
    valid = false;
  }

  if(pattern2.test(famCode))
  {
    formErr.innerHTML += "Family Code must not be blank.\n";
    valid = false;
  }

  return valid;
}

function isValidJoinFam(famName, famCode)
{
  valid = true;
  var pattern1 = RegExp('^[0-9 A-z]+$');
  var pattern2 = RegExp('^ +$');

  formErr = document.getElementById('formErr');
  formErr.innerHTML = '';

  if(!pattern1.test(famName))
  {
    formErr.innerHTML += "Family name must only contian letters, spaces, and numbers\n";
    valid = false;
  }

  if(pattern2.test(famName))
  {
    formErr.innerHTML += "Family name must not be blank.\n";
    valid = false;
  }

  if(!pattern1.test(famCode))
  {
    formErr.innerHTML += "Family Code must only contain letters, spaces and numbers.\n";
    valid = false;
  }

  if(pattern2.test(famCode))
  {
    formErr.innerHTML += "Family Code must not be blank.\n";
    valid = false;
  }

  return valid;
}