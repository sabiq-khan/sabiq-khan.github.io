const MAX_DIVISIONS = 3;
const MAX_TEAMS_PER_DIVISION = 4;
const MAX_SEASONAL_GAMES = 14;

// Creates positive integer options for a select w/in a given range (inclusive)
function createOptionsInRange(selectId, lowerLimit, upperLimit){
    let options = [];
    for (let i = lowerLimit; i < (upperLimit + 1); i++){
        options.push(`<option value='${i}'>${i}</option>`);
    }
    document.getElementById(selectId).innerHTML = options.join("");
}

createOptionsInRange("division-count", 2, MAX_DIVISIONS);
createOptionsInRange("team-count", 1, MAX_TEAMS_PER_DIVISION);
createOptionsInRange("nondiv-week-count", 1, MAX_SEASONAL_GAMES);
createOptionsInRange("div-week-count", 1, MAX_SEASONAL_GAMES);

function validateInitialInputForm(){
    let nonDivisionalWeekCount = document.forms["initial-input-form"]["nondiv-week-count"].value;
    let divisionalWeekCount = document.forms["initial-input-form"]["div-week-count"].value;

    if ((nonDivisionalWeekCount + divisionalWeekCount) != 14){
        message = "Number of divisional and non-divisional weeks does not add up to 14.";
        alert(`Error: ${message}`);
        throw new Error(message);
    }
}
function getSecondaryInputForm(){
    validateInitialInputForm()
    let divisionCount = document.forms["initial-input-form"]["division-count"].value;
    let teamCount = document.forms["initial-input-form"]["team-count"].value;

    let secondaryInputForm = [`<form name="secondary-input-form">`];
    for (let i = 0; i < divisionCount; i++){
        secondaryInputForm.push(`<label>Division ${i + 1}</label><br>`);
        for (let j = 0; j < teamCount; j++){
            secondaryInputForm.push(`<label>Team ${(i * teamCount) + (j + 1)} Name</label><br>`);
            secondaryInputForm.push(`<input name="team-${j + 1}-name" type="text"><br><br>`);
        }
    }

    let nonDivisionalWeekCount = document.forms["initial-input-form"]["nondiv-week-count"].value;
    secondaryInputForm.push("<label>Non-Divisional Weeks</label><br></br>");
    for (let i = 0; i < nonDivisionalWeekCount; i++){
        secondaryInputForm.push(`<select>`);
        for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
            secondaryInputForm.push(`<option value='${j + 1}'>${j + 1}</option>`);
        }
        secondaryInputForm.push("</select><br><br>");
    }

    let divisionalWeekCount = document.forms["initial-input-form"]["div-week-count"].value;
    secondaryInputForm.push("<label>Divisional Weeks</label><br></br>");
    for (let i = 0; i < divisionalWeekCount; i++){
        secondaryInputForm.push(`<select>`);
        for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
            secondaryInputForm.push(`<option value='${j + 1}'>${j + 1}</option>`);
        }
        secondaryInputForm.push("</select><br><br>");
    }

    secondaryInputForm.push(`<button onclick="fetch('/pages/fantasy-football-matchups/fantasy-football-matchups.html')">Clear</button>`);
    secondaryInputForm.push("</form>");
    document.getElementById("form").innerHTML = secondaryInputForm.join("");
}
