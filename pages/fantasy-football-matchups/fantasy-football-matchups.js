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

let divisionCount;
let teamCount;
let nonDivisionalWeekCount;
let divisionalWeekCount;

function validateFirstForm(){
    divisionCount = Number(document.forms["first-form"]["division-count"].value);
    teamCount = Number(document.forms["first-form"]["team-count"].value);
    nonDivisionalWeekCount = Number(document.forms["first-form"]["nondiv-week-count"].value);
    divisionalWeekCount = Number(document.forms["first-form"]["div-week-count"].value);

    console.log(`Division count: ${divisionCount}`);
    console.log(`Team count: ${teamCount}`);
    console.log(`Non-divisional week count: ${nonDivisionalWeekCount}`);
    console.log(`Divisional week count: ${divisionalWeekCount}`);

    if ((nonDivisionalWeekCount + divisionalWeekCount) != 14){
        throw new Error("Number of divisional and non-divisional weeks does not add up to 14.");
    }
}

function createSecondForm(){
    let secondForm = [`<form name="second-form">`];
    for (let i = 0; i < divisionCount; i++){
        secondForm.push(`<label>Division ${i + 1}</label><br>`);
        for (let j = 0; j < teamCount; j++){
            teamNumber = (i * teamCount) + (j + 1);
            inputName = `team-${teamNumber}-name`;
            secondForm.push(`<label>Team ${teamNumber} Name</label><br>`);
            secondForm.push(`<input name="${inputName}" id="${inputName}" type="text"><br><br>`);
        }
    }

    secondForm.push("<label>Non-Divisional Weeks</label><br></br>");
    for (let i = 0; i < nonDivisionalWeekCount; i++){
        selectName = `nondiv-week-select-${i}`;
        secondForm.push(`<select name=${selectName} id="${selectName}">`);
        for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
            secondForm.push(`<option value='${j + 1}'>${j + 1}</option>`);
        }
        secondForm.push("</select><br><br>");
    }

    secondForm.push("<label>Divisional Weeks</label><br></br>");
    for (let i = 0; i < divisionalWeekCount; i++){
        selectName = `div-week-select-${i}`;
        secondForm.push(`<select name=${selectName} id="${selectName}">`);
        for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
            secondForm.push(`<option value='${j + 1}'>${j + 1}</option>`);
        }
        secondForm.push("</select><br><br>");
    }

    secondForm.push(`<button onclick="fetch('/pages/fantasy-football-matchups/fantasy-football-matchups.html')">Clear</button><br>`);
    secondForm.push(`<button name="second-form-submit" id="second-form-submit">Submit</button>`);
    secondForm.push("</form>");
    document.getElementById("form").innerHTML = secondForm.join("");

    document.getElementById("second-form-submit").addEventListener("click", function(event){
        event.preventDefault();
    
        try {
            validateSecondForm();
            createSeasonalMatchups();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    });
}

document.getElementById("first-form-submit").addEventListener("click", function(event){
    event.preventDefault();

    try {
        validateFirstForm();
        createSecondForm();
    } catch (error) {
        console.error(error);
        alert(error);
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

function resetAndThrow(errorMessage){
    league = [];
    nonDivisionalWeeks = [];
    divisionalWeeks = [];
    throw new Error(errorMessage);
}

function validateSecondForm(){
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
        resetAndThrow("All non-divisional weeks must be unique.");
    }
    if (!(allUnique(divisionalWeeks))){
        resetAndThrow("All divisional weeks must be unique.");
    }
    if (!(arraysExclusive(nonDivisionalWeeks, divisionalWeeks))){
        resetAndThrow("Divisional and non-divisional weeks must all be different.");
    }
}
