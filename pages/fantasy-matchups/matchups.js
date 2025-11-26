import './constants.js'
import { recursiveDeepCopy } from './utils.js'

export class MatchupCreator {
    constructor(league, schedule) {
        this.league = league
        this.schedule = schedule
        this.matchups = []
    }

    divMatchupExistsTwice(currentWeek, team1, team2){
        let count = 0;
        for (let i = 0; i < this.schedule.divWeeks.length; i++){
            const week = this.schedule.divWeeks[i];
            if (week > currentWeek){
                break;
            }
            if ((week <= currentWeek) && ((this.matchups[week].includes([team1, team2])) || (this.matchups[week].includes([team2, team1])))) {
                count++;
            }
            if (count == 2){
                return true;
            }
        }

        return false;
    }

    nonDivMatchupExists(currentWeek, team1, team2){
        for (let i = 0; i < this.schedule.nonDivWeeks.length; i++){
            const week = this.schedule.nonDivWeeks[i];
            if (week > currentWeek){
                break;
            }
            if ((week <= currentWeek) && ((this.matchups[week].includes([team1, team2])) || (this.matchups.includes([team2, team1])))) {
                return true;
            }
        }

        return false;
    }

    createDivisionalMatchups(week, div){
        const teams = deepCopy(div);
        while (teams.length > 0){
            const matchIndex = getRandomInRange(1, teams.length);
            const team1 = teams[0];
            const team2 = teams[matchIndex];
            if (!this.divMatchupExistsTwice(week, team1, team2)){
                const matchup = [team1, team2];
                this.matchups[week].push(matchup);
                teams.splice(matchIndex, 1);
                teams.splice(0, 1);
            }
        }
    }

    createNonDivMatchups(week) {
        while (this.matchups[week].length < 6){
            this.matchups[week] = [];
            let divs = recursiveDeepCopy(this.league);
            const maxAttempts = divs[0].length * divs[1].length;
            let attempts = 0;
            while ((divs.length >= 2) && (divs[0].length > 0) && (divs[1].length> 0)){
                const div1 = divs[0];
                const div2 = divs[1];

                const team1 = div1[0];
                const team2 = div2[0];

                if (!this.nonDivMatchupExists(week, team1, team2)){
                    const matchup = [team1, team2];
                    this.matchups[week].push(matchup);
                    div1.splice(0, 1);
                    div2.splice(0, 1);
                    if (div2.length == 0){
                        divs.splice(1, 1);
                    }
                    if (div1.length == 0){
                        divs.splice(0, 1);
                    }
                    divs = divs.slice(1).concat(divs.slice(0, 1));
                    attempts = 0;
                } else if ((attempts > Math.max(div1.length, div2.length)) && ((div1.length == 1) || (div2.length == 1))){
                    break;
                } else if (attempts < maxAttempts){
                    div2 = div2.slice(1).concat(div2.splice(0, 1));
                    attempts++;
                } else if (attempts >= maxAttempts){
                    divs = divs.slice(1).concat(divs.slice(0, 1));
                    attempts = 0;
                }
            }
        }
    }

    createMatchups(){
        for (let week = 1; week < (MAX_SEASONAL_GAMES + 1); week++){
            this.matchups.push([]);
            if (this.schedule.nonDivWeeks.includes(week)){
                this.createNonDivMatchups(week);
            } else if (schedule.divWeeks.includes(week)) {
                this.league.forEach((div) => this.createNonDivMatchups(week, div));
            }
        }
    }

    showMatchups(){
        const matchupTable = [];
        matchupTable.push("<table>");
        matchupTable.push("<tr>");
        COLUMNS.forEach((column) => {
            matchupTable.push(`<th>${column}</th>`);
        });
        matchupTable.push("</tr>");
        for (let week = 1; week < (MAX_SEASONAL_GAMES + 1); week++){
            this.matchups[week].forEach((matchup) => {
                matchupTable.push("<tr>");
                matchupTable.push(`<td>${week}</td>`);
                matchupTable.push(`<td>${matchup[0]}</td>`);
                matchupTable.push(`<td>${matchup[1]}</td>`);
                matchupTable.push("</tr>");
            });
        }
        matchupTable.push("</table>");

        document.getElementById("app").innerHTML = matchupTable.join("");
    }
}