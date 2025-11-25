import './constants.js'
import { allUnique, arraysExclusive } from './utils.js'

export class Schedule {
    static createForm(nonDivWeekCount, divWeekCount) {
        let form = [`<form name="schedule">`];
        form.push("<label>Non-Divisional Weeks</label><br></br>");
        for (let i = 0; i < nonDivWeekCount; i++){
            const week = `nondiv-week-${i}`;
            form.push(`<select name=${week} id="${week}">`);
            for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
                form.push(`<option value='${j + 1}'>${j + 1}</option>`);
            }
            form.push("</select><br><br>");
        }

        form.push("<label>Divisional Weeks</label><br></br>");
        for (let i = 0; i < divWeekCount; i++){
            const week = `div-week-${i}`;
            form.push(`<select name=${week} id="${week}">`);
            for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
                form.push(`<option value='${j + 1}'>${j + 1}</option>`);
            }
            form.push("</select><br><br>");
        }

        form.push(`<button onclick="fetch('/pages/fantasy-matchups/fantasy-matchups.html')">Clear</button><br>`);
        form.push(`<button name="schedule-submit" id="schedule-submit">Submit</button>`);
        form.push("</form>");
        document.getElementById("app").innerHTML = form.join("");
    }

    static fromForm(nonDivWeekCount, divWeekCount) {
        Schedule.createForm(nonDivWeekCount, divWeekCount)
        document.getElementById("schedule-submit").addEventListener("click", function(event) {
            event.preventDefault();
            try {
                const nonDivWeeks = []
                const divWeeks = []
                for (let i = 0; i < nonDivWeekCount; i++){
                    week = Number(document.getElementById(`nondiv-week-${i}`).value);
                    nonDivWeeks.push(week);
                }
                for (let i = 0; i < divWeekCount; i++){
                    week = Number(document.getElementById(`div-week-${i}`).value);
                    divWeeks.pu
                    sh(week);
                }
                return new Schedule(divWeeks, nonDivWeeks);
            } catch(error) {
                throw error;
            }
        })
    }

    static validate(divWeeks, nonDivWeeks) {
        if (!(allUnique(divWeeks))){
            throw Error("All divisional weeks must be unique.");
        }
        if (!(allUnique(nonDivWeeks))){
            throw Error("All non-divisional weeks must be unique.");
        }
        if (!(arraysExclusive(divWeeks, nonDivWeeks))){
            throw Error("Divisional and non-divisional weeks must all be different.");
        }

        return true;
    }

    constructor(divWeeks, nonDivWeeks) {
        this.divWeeks = divWeeks;
        this.nonDivWeeks = nonDivWeeks;
        Schedule.validate(this.divWeeks, this.nonDivWeeks);
    }
}