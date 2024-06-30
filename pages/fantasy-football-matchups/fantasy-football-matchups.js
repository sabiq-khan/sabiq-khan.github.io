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

let divisionCount = Number(document.forms["initial-input-form"]["division-count"].value);
let teamCount = Number(document.forms["initial-input-form"]["team-count"].value);
let nonDivisionalWeekCount = Number(document.forms["initial-input-form"]["nondiv-week-count"].value);
let divisionalWeekCount = Number(document.forms["initial-input-form"]["div-week-count"].value);

function validateInitialInputForm(){
    nonDivisionalWeekCount = Number(document.forms["initial-input-form"]["nondiv-week-count"].value);
    divisionalWeekCount = Number(document.forms["initial-input-form"]["div-week-count"].value);

    if ((nonDivisionalWeekCount + divisionalWeekCount) != 14){
        message = "Number of divisional and non-divisional weeks does not add up to 14.";
        throw new Error(message);
    }
}

function createSecondaryInputForm(){
    divisionCount = Number(document.forms["initial-input-form"]["division-count"].value);
    teamCount = Number(document.forms["initial-input-form"]["team-count"].value);

    let secondaryInputForm = [`<form name="secondary-input-form">`];
    for (let i = 0; i < divisionCount; i++){
        secondaryInputForm.push(`<label>Division ${i + 1}</label><br>`);
        for (let j = 0; j < teamCount; j++){
            teamNumber = (i * teamCount) + (j + 1);
            inputName = `team-${teamNumber}-name`;
            secondaryInputForm.push(`<label>Team ${teamNumber} Name</label><br>`);
            secondaryInputForm.push(`<input name="${inputName}" id="${inputName}" type="text"><br><br>`);
        }
    }

    nonDivisionalWeekCount = Number(document.forms["initial-input-form"]["nondiv-week-count"].value);
    secondaryInputForm.push("<label>Non-Divisional Weeks</label><br></br>");
    for (let i = 0; i < nonDivisionalWeekCount; i++){
        selectName = `nondiv-week-select-${i}`;
        secondaryInputForm.push(`<select name=${selectName} id="${selectName}">`);
        for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
            secondaryInputForm.push(`<option value='${j + 1}'>${j + 1}</option>`);
        }
        secondaryInputForm.push("</select><br><br>");
    }

    divisionalWeekCount = Number(document.forms["initial-input-form"]["div-week-count"].value);
    secondaryInputForm.push("<label>Divisional Weeks</label><br></br>");
    for (let i = 0; i < divisionalWeekCount; i++){
        selectName = `div-week-select-${i}`;
        secondaryInputForm.push(`<select name=${selectName} id="${selectName}">`);
        for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
            secondaryInputForm.push(`<option value='${j + 1}'>${j + 1}</option>`);
        }
        secondaryInputForm.push("</select><br><br>");
    }

    secondaryInputForm.push(`<button onclick="fetch('/pages/fantasy-football-matchups/fantasy-football-matchups.html')">Clear</button><br>`);
    secondaryInputForm.push(`<button name="secondary-input-form-submit" id="secondary-input-form-submit">Submit</button>`);
    secondaryInputForm.push("</form>");
    document.getElementById("form").innerHTML = secondaryInputForm.join("");

    document.getElementById("secondary-input-form-submit").addEventListener("click", function(event){
        event.preventDefault();
    
        try {
            validateSecondaryInputForm();
            createSeasonalMatchups();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    });
}

document.addEventListener("DOMContentLoaded", function(){
    let initialInputFormSubmit = document.getElementById("initial-input-form-submit");
    if (initialInputFormSubmit) {
        initialInputFormSubmit.addEventListener("click", function(event){
            event.preventDefault();
        
            try {
                validateInitialInputForm();
                createSecondaryInputForm();
            } catch (error) {
                console.error(error);
                alert(error);
            }
        });
    }
});

let league = []
let nonDivisionalWeeks = []
let divisionalWeeks = []

// Checks if every element of an array is unique
function allUnique(array){
    let set = new Set(array);
    if (set.size == array.length){
        return true;
    }

    return false;
}

// Verifies that 2 arrays don't contain the same elements
function arraysExclusive(array1, array2){
    let union = [...array1, ...array2];
    return allUnique(union);
}

function validateSecondaryInputForm(){
    console.log("Hit validation function for secondary input form.");
    console.log(`Division count: ${divisionCount}`);
    console.log(`Team count: ${teamCount}`);
    console.log(`Non-divisional week count: ${nonDivisionalWeekCount}`);
    console.log(`Divisional week count: ${divisionalWeekCount}`);


    for (let i = 0; i < nonDivisionalWeekCount; i++){
        week = Number(document.getElementById(`nondiv-week-select-${i}`).value);
        nonDivisionalWeeks.push(week);
    }

    for (let i = 0; i < divisionalWeekCount; i++){
        week = Number(document.getElementById(`div-week-select-${i}`).value);
        divisionalWeeks.push(week);
    }

    for (let i = 0; i < divisionCount; i++){
        division = [];
        for (let j = 0; j < teamCount; j++){
            teamNumber = (i * teamCount) + (j + 1);
            inputName = `team-${teamNumber}-name`;
            team = document.getElementById(inputName).value;
            division.push(team);
        }
        league.push(division)
    }

    console.log(`League: ${league}`);
    console.log(`Non-divisional weeks: ${nonDivisionalWeeks}`);
    console.log(`Divisional weeks: ${divisionalWeeks}`);

    if (!(allUnique(nonDivisionalWeeks))){
        message = "All non-divisional weeks must be unique.";
        throw new Error(message);
    }
    if (!(allUnique(divisionalWeeks))){
        message = "All divisional weeks must be unique.";
        throw new Error(message);
    }
    if (!(arraysExclusive(nonDivisionalWeeks, divisionalWeeks))){
        message = "Divisional and non-divisional weeks must all be different.";
        throw new Error(message);
    }
}
