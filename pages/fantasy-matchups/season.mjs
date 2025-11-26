import { MAX_DIVISIONS, MAX_TEAMS_PER_DIVISION, MAX_SEASONAL_GAMES } from './constants.js'
import { createOptionsInRange } from './utils.mjs'

const FORM = `
<form name="season">
    <label>How many divisions?</label><br>
    <select name="divisions" id="divisions">
    </select><br><br>

    <label>How many teams per division?</label><br>
    <select name="teams" id="teams">
    </select><br><br>

    <label>How many non-divisional weeks?</label><br>
    <select name="nondiv-weeks" id="nondiv-weeks">
    </select><br><br>

    <label>How many divisional weeks?</label><br>
    <select name="div-weeks" id="div-weeks">
    </select><br><br>

    <button name="season-submit" id="season-submit">Submit</button>
</form>
`;

export class Season {
    static createForm() {
        document.getElementById("app").innerHTML = FORM;
        createOptionsInRange("divisions", 2, MAX_DIVISIONS);
        createOptionsInRange("teams", 1, MAX_TEAMS_PER_DIVISION);
        createOptionsInRange("nondiv-weeks", 1, MAX_SEASONAL_GAMES);
        createOptionsInRange("div-weeks", 1, MAX_SEASONAL_GAMES);
    }

    static fromForm () {
        Season.createForm()
        document.getElementById("season-submit").addEventListener("click", function(event) {
            event.preventDefault();
            try {
                const divs = Number(document.forms["season"]["divisions"].value);
                const teams = Number(document.forms["season"]["teams"].value);
                const nonDivWeeks = Number(document.forms["season"]["nondiv-weeks"].value);
                const divWeeks = Number(document.forms["season"]["div-weeks"].value);

                return new Season(divs, teams, nonDivWeeks, divWeeks);
            } catch (error) {
                throw error;
            }
        })
    }

    static isValid(nonDivWeeks, divWeeks) {
        if ((nonDivWeeks + divWeeks) != 14){
            return false;
        }

        return true;
    }

    constructor(divs, teams, nonDivWeeks, divWeeks) {
        this.divs = divs;
        this.teams = teams;
        this.nonDivWeeks = nonDivWeeks;
        this.divWeeks = divWeeks;

        if (!Season.isValid(this.nonDivWeeks, this.divWeeks)) {
            throw new Error("Number of divisional and non-divisional weeks does not add up to 14.");
        }
    }
}