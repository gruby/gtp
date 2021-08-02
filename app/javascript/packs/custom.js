/*
function dosmth() { 
  alert('hello'); 
}

//document.addEventListener('turbolinks:load', () => {  
document.addEventListener('DOMContentLoaded', () => {  
  const clickButton = document.getElementById("button-click");  

  clickButton.addEventListener("click", dosmth); 
});
*/

document.addEventListener('DOMContentLoaded', () => {
  inputField = document.getElementById('inputwindow');
  outputField = document.getElementById('outputwindow');
  sbvToSrtButton = document.getElementById('sbvtosrt');
  srtToSbvButton = document.getElementById('srttosbv');
  shiftValue = document.getElementById('shiftvalue');
  timeShifter = document.getElementById('timeshift');
  sbvToSrtButton.addEventListener('click', () => {
    outputField.value = convertSbvToSrt(inputField.value)
  });
  srtToSbvButton.addEventListener('click', () => {
    outputField.value = convertSrtToSbv(inputField.value)
  });
  timeShifter.addEventListener('click', () => {
    shiftDirection = shiftValue.value[0];
    if (!(shiftDirection == "+" || shiftDirection == "-")) {
      outputField.value = "+ or - must be specified";
    } else {
      outputField.value = returnShiftedCaptions(inputField.value);
    }    
  });
  document.getElementById('inputwindow').value = "";
  document.getElementById('outputwindow').value = "";
  document.getElementById('shiftvalue').value = "+0:00:00.000";
});

function convertSbvToSrt(caps) {
  let outcomeString = "";
  let i = 0;
  caps.split('\n').forEach(line => {
    if (line.match(/\d{1,2}:\d{1,2}:\d{1,2}\.\d{3},\d{1,2}:\d{1,2}:\d{1,2}\.\d{3}/)) {
      i++;
      outcomeString = outcomeString.concat("\n");
      outcomeString = outcomeString.concat(i);
      outcomeString = outcomeString.concat("\n");
      outcomeString = outcomeString.concat(line.replace(',', " --> ").replaceAll('.', ','));
    } else {
      outcomeString = outcomeString.concat("\n");
      outcomeString = outcomeString.concat(line);
    }
  });
  outcomeString = outcomeString.substring(1);
  return outcomeString
};
  
function convertSrtToSbv(caps) {
  let outcomeString = "";
  let arrayOfCaptions = caps.split('\n');

  for (let cap in arrayOfCaptions) {
    if (!(arrayOfCaptions[cap].match(/^\d{1,6}$/) && arrayOfCaptions[parseInt(cap)+1].match(/\d{1,2}:\d{1,2}:\d{1,2},\d{3}\s?-->\s?\d{1,2}:\d{1,2}:\d{1,2},\d{3}/))) {
      if (arrayOfCaptions[cap].match(/\d{1,2}:\d{1,2}:\d{1,2},\d{3}\s?-->\s?\d{1,2}:\d{1,2}:\d{1,2},\d{3}/)) {
        outcomeString = outcomeString.concat(arrayOfCaptions[cap].replaceAll(' ', '').replaceAll(',', '.').replace('-->', ','));
        outcomeString = outcomeString.concat("\n");
      } else {
        outcomeString = outcomeString.concat(arrayOfCaptions[cap]);
        outcomeString = outcomeString.concat("\n");
      }
    }
  }
  return outcomeString;
}

function returnShiftedCaptions(caps) {
  outcomeString = ""
  caps.split('\n').forEach(line => {
    if (line.match(/\d{1,2}:\d{1,2}:\d{1,2}\.\d{3},\d{1,2}:\d{1,2}:\d{1,2}\.\d{3}/)) {
      outcomeString = outcomeString.concat(returnTimestamp(line))
    } else {
      outcomeString = outcomeString.concat(line);
      outcomeString = outcomeString.concat("\n");
    }
  })
  
  if (outcomeString.includes("|||")) {
    return outcomeString.split("|||")[1];
  } else {
    return outcomeString;
  }
}

function convertToMiliseconds(timestamp) {
  splitTimestamp = timestamp.replace('.',':').split(':');
  hoursInMiliseconds = parseInt(splitTimestamp[0]*60*60*1000 );
  minutesInMiliseconds = (parseInt(splitTimestamp[1])*60*1000 );
  secondsInMiliseconds = (parseInt(splitTimestamp[2])*1000);
  miliseconds = parseInt(splitTimestamp[3]);
  total = hoursInMiliseconds + minutesInMiliseconds + secondsInMiliseconds + miliseconds;
  return total;
}

function convertToTimestamp(miliseconds) {
  hoursInTimestamp = (Math.floor(parseInt(miliseconds)/3_600_000));
  minutesInTimestamp = ( Math.floor( (parseInt(miliseconds) % 3_600_000)/60_000 ) );
  secondsInTimestamp = Math.floor((parseInt(miliseconds) - (parseInt(hoursInTimestamp)*3_600_000 + parseInt(minutesInTimestamp)*60_000))/1000);
  milisecondsInTimestamp = parseInt(miliseconds) - (parseInt(hoursInTimestamp)*3_600_000 + parseInt(minutesInTimestamp)*60_000 + parseInt(secondsInTimestamp)*1000);
  total = `${hoursInTimestamp}:${formatToNPlaces(2, minutesInTimestamp)}:${formatToNPlaces(2, secondsInTimestamp)}.${formatToNPlaces(3, milisecondsInTimestamp)}`
  return total;
}

function returnTimestamp(timeStampLine) {
  vector = shiftValue.value[0];
  shift = convertToMiliseconds(shiftValue.value.substring(1));
  let splittedTimestamp = timeStampLine.split(",");
  firstTimeStamp = splittedTimestamp[0];
  secondTimeStamp = splittedTimestamp[1];
  resutlTimestamp = "";  
  if (vector == "+") {
    resutlTimestamp = resutlTimestamp.concat( convertToTimestamp(convertToMiliseconds(firstTimeStamp) + shift ));
    resutlTimestamp = resutlTimestamp.concat(',');
    resutlTimestamp = resutlTimestamp.concat( convertToTimestamp(convertToMiliseconds(secondTimeStamp) + shift ));
    resutlTimestamp = resutlTimestamp.concat('\n');
  } else {
    firstReducedTimestampInMiliseconds = convertToMiliseconds(firstTimeStamp) - shift;
    secondReducedTimestampInMiliseconds = convertToMiliseconds(secondTimeStamp) - shift;
    if (firstReducedTimestampInMiliseconds <= 0 && secondReducedTimestampInMiliseconds > 0) {
      resutlTimestamp = resutlTimestamp.concat('|||');
    }
    if (convertToMiliseconds(splittedTimestamp[0]) - shift <= 0) {
      resutlTimestamp = resutlTimestamp.concat("0:00:00.000,");
    } else {
      resutlTimestamp = resutlTimestamp.concat( convertToTimestamp(firstReducedTimestampInMiliseconds) );
      resutlTimestamp = resutlTimestamp.concat(",");
    }
    if (convertToMiliseconds(splittedTimestamp[1]) - shift <= 0) {
      resutlTimestamp = resutlTimestamp.concat("0:00:00.000\n");
    } else {
      resutlTimestamp = resutlTimestamp.concat( convertToTimestamp(secondReducedTimestampInMiliseconds) );
      resutlTimestamp = resutlTimestamp.concat("\n");
    }
  }

  return resutlTimestamp
}

function formatToNPlaces(n, digits) {
  if (String(digits).length == n) {
    return String(digits)
  } else if ( parseInt(n) - String(digits).length  == 1 ) {
    return `0${String(digits)}`;
  } else if ( parseInt(n) - String(digits).length  == 2 ) {
    return `00${String(digits)}`;
  } else {
    return "Something is wrong";
  }
}
