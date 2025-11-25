import './constants.js'

class Division {
    constructor(teams) {
        this.teams = teams
    }
}

export class League {
    static createForm(divs, teams) {
        let form = [`<form name="league">`];
        for (let i = 0; i < divs; i++){
            form.push(`<label>Division ${i + 1}</label><br>`);
            for (let j = 0; j < teams; j++){
                const teamNumber = (i * teams) + (j + 1);
                const team = `team-${teamNumber}`;
                form.push(`<label>Team ${teamNumber} Name</label><br>`);
                form.push(`<input name="${team}" id="${team}" type="text"><br><br>`);
            }
        }

        form.push(`<button onclick="fetch('/pages/fantasy-matchups/fantasy-matchups.html')">Clear</button><br>`);
        form.push(`<button name="league-submit" id="league-submit">Submit</button>`);
        form.push("</form>");
        document.getElementById("app").innerHTML = form.join("");
    }

    static fromForm(divs, teams, nonDivWeeks, divWeeks) {
        League.createForm(divs, teams, nonDivWeeks, divWeeks)
        document.getElementById("league-submit").addEventListener("click", function(event) {
            event.preventDefault;
            try {
                // TODO: Add logic for how second form is parsed
            } catch(error) {
                throw error;
            }
        })
    }

    constructor(divs, nonDivWeeks, divWeeks) {
        this.divs = divs
        this.nonDivWeeks = nonDivWeeks
        this.divWeeks = divWeeks
    }
}