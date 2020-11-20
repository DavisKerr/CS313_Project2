exports.calculateRate = function calculateRate(weight, type, zone)
{
  var total = 0;
  switch(type)
  {
    case('LS'):
      total = calcLSTotal(weight);
      break;
    case('LM'):
      total = calcLMTotal(weight);
      break;
    case('LE'):
    total = calculateLETotal(weight);
      break;
    case('FCP'):
    total = calcFCPTotal(weight, zone)
      break;
  }
  if(total != 0)
  {
    return {
      weight: weight,
      type: (type == 'LS' ? 'Letter (Stamped)':(type == 'LM' ? 'Letter (Metered)':(type == 'LE' ? 'Large Envelopes (Flats)':'First-Class Package Service - Retail'))),
      total: total,
      zone: (zone == 0 ? 'n/a' : zone),
      error: false
    };
  }
  else
  {
    return {
      weight: '',
      type: '',
      zone: '',
      total: '',
      error: true
    };
  }
}

function calcFCPTotal(weight, zone)
{
  if(weight <= 4.0)
  {
    return (zone < 3 ? 3.80 : (zone == 3 ? 3.85 : (zone == 4 ? 3.90 : (zone == 5 ? 3.95 : (zone == 6 ? 4.00 : (zone == 7 ? 4.05 : 4.20))))));
  }
  else if(weight <= 8.0)
  {
    return (zone < 3 ? 4.60 : (zone == 3 ? 4.65 : (zone == 4 ? 4.70 : (zone == 5 ? 4.75 : (zone == 6 ? 4.80 : (zone == 7 ? 4.90 : 5.00))))));
  }
  else if(weight <= 12.0)
  {
    return (zone < 3 ? 5.30 : (zone == 3 ? 5.35 : (zone == 4 ? 5.40 : (zone == 5 ? 5.45 : (zone == 6 ? 5.50 : (zone == 7 ? 5.65 : 5.75))))));
  }
  else if(weight <= 13.0)
  {
    return (zone < 3 ? 5.90 : (zone == 3 ? 5.95 : (zone == 4 ? 6.05 : (zone == 5 ? 6.15 : (zone == 6 ? 6.20 : (zone == 7 ? 6.40 : 6.50))))));
  }
  
}

function calculateLETotal(weight)
{
  if(weight <= 13)
  {
    return 1.00 + (weight - 1 < 0 ? 0 : Math.floor(weight - 1)) * 0.20
  }
  else
  {
    return 0;
  }
}

function calcLMTotal(weight)
{
  if(weight <= 1)
  {
    return 0.50;
  }
  else if(weight <= 2)
  {
    return 0.65;
  }
  else if(weight <= 3)
  {
    return 0.80;
  }
  else if(weight <= 3.5)
  {
    return 0.95;
  }
  else
  {
    return 0;
  }  
}

function calcLSTotal(weight)
{
  if(weight <= 1)
  {
    return 0.55;
  }
  else if(weight <= 2)
  {
    return 0.70;
  }
  else if(weight <= 3)
  {
    return 0.85;
  }
  else if(weight <= 3.5)
  {
    return 1.00;
  }
  else
  {
    return 0;
  }
}







