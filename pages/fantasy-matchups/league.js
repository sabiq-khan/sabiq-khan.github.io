import './constants.js'

class Division {
    constructor(teams) {
        this.teams = teams
    }
}

export class League {
    static createForm(divCount, teamCount) {
        let form = [`<form name="league">`];
        for (let i = 0; i < divCount; i++){
            form.push(`<label>Division ${i + 1}</label><br>`);
            for (let j = 0; j < teamCount; j++){
                const teamNumber = (i * teamCount) + (j + 1);
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

    static fromForm(divCount, teamCount) {
        League.createForm(divCount, teamCount)
        document.getElementById("league-submit").addEventListener("click", function(event) {
            event.preventDefault;
            try {
                const divs = [];
                for (let i = 0; i < divCount; i++){
                    const teams = [];
                    for (let j = 0; j < teamCount; j++){
                        const teamNumber = (i * teamCount) + (j + 1);
                        const team = document.getElementById(`team-${teamNumber}`).value;
                        teams.push(team);
                    }
                    const div = new Division(teams);
                    divs.push(div);
                }
            } catch(error) {
                throw error;
            }
        })
    }

    constructor(divs) {
        this.divs = divs
    }
}