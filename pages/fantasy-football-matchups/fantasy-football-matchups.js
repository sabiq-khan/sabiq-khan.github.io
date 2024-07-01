const MAX_DIVISIONS = 3;
const MAX_TEAMS_PER_DIVISION = 4;
const MAX_SEASONAL_GAMES = 14;
const COLUMNS = ["WEEK", "TEAM1", "TEAM2"];

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
            writeMatchupsToTable();
        } catch (error) {
            console.error(error);
            alert(error);
            league = [];
            nonDivisionalWeeks = [];
            divisionalWeeks = [];
            seasonalMatchups = [];
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

// Creates a deep copy of an array in a different memory location
function deepCopy(array){
    let newArray = [];
    for (let i = 0; i < array.length; i++){
        value = array[i];
        newArray.push(value);
    }
    return newArray;
}

// Deep copy for 2D arrays
function recursiveDeepCopy(nestedArray){
    let newNestedArray = [];
    for (let i = 0; i < nestedArray.length; i++){
        innerArray = deepCopy(nestedArray[i]);
        newNestedArray.push(innerArray);
    }
    return newNestedArray;
}

// 1-indexing instead of 0-indexing this array so index == week
let seasonalMatchups = [];
seasonalMatchups.push([]);

function divisionalMatchupExistsTwice(currentWeek, team1, team2){
    count = 0;
    for (let i = 0; i < divisionalWeeks.length; i++){
        week = divisionalWeeks[i];
        if (week > currentWeek){
            break;
        }
        if ((week <= currentWeek) && ((seasonalMatchups[week].includes([team1, team2])) || (seasonalMatchups[week].includes([team2, team1])))) {
            count++;
        }
        if (count == 2){
            return true;
        }
    }

    return false;
}

function nonDivisionalMatchupExists(currentWeek, team1, team2){
    for (let i = 0; i < nonDivisionalWeeks.length; i++){
        week = nonDivisionalWeeks[i];
        if (week > currentWeek){
            break;
        }
        if ((week <= currentWeek) && ((seasonalMatchups[week].includes([team1, team2])) || (seasonalMatchups.includes([team2, team1])))) {
            return true;
        }
    }

    return false;
}

// Generates a random int between 2 numbers, excluding upper limit
function getRandomInRange(lowerLimit, upperLimit){
    const range = Math.floor(upperLimit - lowerLimit);
    let randomInt = lowerLimit + Math.floor((Math.random() * range));
    return randomInt;
}

function createDivisionalMatchups(week, division){
    teams = deepCopy(division);
    while (teams.length > 0){
        matchIndex = getRandomInRange(1, teams.length);
        team1 = teams[0];
        team2 = teams[matchIndex];
        if (!divisionalMatchupExistsTwice(week, team1, team2)){
            matchup = [team1, team2];
            seasonalMatchups[week].push(matchup);
            teams.splice(matchIndex, 1);
            teams.splice(0, 1);
        }
    }
}

function createNonDivisionalMatchups(week){
    while (seasonalMatchups[week].length < 6){
        seasonalMatchups[week] = [];
        divisions = recursiveDeepCopy(league);
        maxAttempts = divisions[0].length * divisions[1].length;
        attempts = 0;
        while ((divisions.length >= 2) && (divisions[0].length > 0) && (divisions[1].length> 0)){
            division1 = divisions[0];
            division2 = divisions[1];

            team1 = division1[0];
            team2 = division2[0];

            if (!nonDivisionalMatchupExists(week, team1, team2)){
                matchup = [team1, team2];
                seasonalMatchups[week].push(matchup);
                division1.splice(0, 1);
                division2.splice(0, 1);
                if (division2.length == 0){
                    divisions.splice(1, 1);
                }
                if (division1.length == 0){
                    divisions.splice(0, 1);
                }
                divisions = divisions.slice(1).concat(divisions.slice(0, 1));
                attempts = 0;
            } else if ((attempts > Math.max(division1.length, division2.length)) && ((division1.length == 1) || (division2.length == 1))){
                break;
            } else if (attempts < maxAttempts){
                division2 = division2.slice(1).concat(division2.splice(0, 1));
                attempts++;
            } else if (attempts >= maxAttempts){
                divisions = divisions.slice(1).concat(divisions.slice(0, 1));
                attempts = 0;
            }
        }
    }
}

function createSeasonalMatchups(){
    for (let week = 1; week < (MAX_SEASONAL_GAMES + 1); week++){
        seasonalMatchups.push([]);
        if (nonDivisionalWeeks.includes(week)){
            createNonDivisionalMatchups(week);
        } else if (divisionalWeeks.includes(week)) {
            league.forEach((division) => createDivisionalMatchups(week, division));
        }
    }
}

function writeMatchupsToTable(){
    let matchupTable = [];
    matchupTable.push("<table>");
    matchupTable.push("<tr>");
    COLUMNS.forEach((column) => {
        matchupTable.push(`<th>${column}</th>`);
    });
    matchupTable.push("</tr>");
    for (let week = 1; week < (MAX_SEASONAL_GAMES + 1); week++){
        seasonalMatchups[week].forEach((matchup) => {
            matchupTable.push("<tr>");
            matchupTable.push(`<td>${week}</td>`);
            matchupTable.push(`<td>${matchup[0]}</td>`);
            matchupTable.push(`<td>${matchup[1]}</td>`);
            matchupTable.push("</tr>");
        });
    }
    matchupTable.push("</table>");

    document.getElementById("matchup-table").innerHTML = matchupTable.join("");
}
