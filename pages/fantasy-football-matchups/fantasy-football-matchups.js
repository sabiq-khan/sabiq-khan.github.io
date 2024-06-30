const MAX_DIVISIONS = 3;
const MAX_TEAMS_PER_DIVISION = 4;
const MAX_SEASONAL_GAMES = 14;

let divisionCountOptions = [];
for (let i = 0; i < MAX_DIVISIONS; i++){
    divisionCountOptions.push(`<option value='${i + 1}'>${i + 1}</option>`);
}
document.getElementById("division-count").innerHTML = divisionCountOptions.join("");

let teamCountOptions = [];
for (let i = 0; i < MAX_TEAMS_PER_DIVISION; i++){
    teamCountOptions.push(`<option value='${i + 1}'>${i + 1}</option>`)
}
document.getElementById("team-count").innerHTML = teamCountOptions.join("");

let nonDivisionalWeekCountOptions = [];
for (let i = 0; i < MAX_SEASONAL_GAMES; i++){
    nonDivisionalWeekCountOptions.push(`<option value='${i + 1}'>${i + 1}</option>`);
}
document.getElementById("nondiv-week-count").innerHTML = nonDivisionalWeekCountOptions.join("");

let divisionalWeekCountOptions = [];
for (let i = 0; i < MAX_SEASONAL_GAMES; i++){
    divisionalWeekCountOptions.push(`<option value='${i + 1}'>${i + 1}</option>`);
}
document.getElementById("div-week-count").innerHTML = divisionalWeekCountOptions.join("");

function getSecondaryInputForm(){
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
