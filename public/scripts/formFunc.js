$(document).ready(function(){

  addZone();

});

function addZone()
{
  var place = document.getElementById("zoneSelect");

  if(document.getElementById('type').value != 'FCP')
  {
    place.innerHTML = '';
    return 0;
  }
  
  if(place.innerHTML == '')
  {
    var form = "<label for='zone'>Please choose a zone:</label><select id='zone' name='zone'>";
    for(var i = 1; i < 10; i++)
    {
      form += ("<option value='" + i + "'>" + i + "</option>");
    }
    form += '</select>';
    place.innerHTML = form;
  }
  else
  {
    place.innerHTML = '';
  }
}

function validateForm()
{
  var isValid = true;
  var weight = document.getElementById("weight").value;
  var type = document.getElementById("type").value;
  var zone = 0;

  var error = document.getElementById('error');
  error.innerHTML = '';

  if(type == 'FCP')
  {
    zone = document.getElementById("zone").value;
  }

  if((type == 'LS' || type == 'LE') && (weight <= 0 || weight > 3.5))
  {
    isValid = false;
    error.innerHTML = 'The weight for that type of mail must be greater than 0 oz and less than 3.5 oz';
  }

  if((type == 'LE') && (weight <= 0 || weight > 13.0))
  {
    isValid = false;
    error.innerHTML = 'The weight for that type of mail must be greater than 0 oz and less than 13 oz';
  }

  if((type == 'FCP') && ((weight <= 0 || weight > 13.0) || (zone < 1 || zone > 9)))
  {
    isValid = false;
    error.innerHTML = 'The weight for that type of mail must be greater than 0 oz and less than 13 oz';
  }
  return isValid;
}