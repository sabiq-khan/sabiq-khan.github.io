import { Season } from './season.js'
import { League } from './league.js'
import { Schedule } from './schedule.js'
import { MatchupCreator } from './matchups'

function main() {
    try {
        const season = Season.fromForm();
        const league = League.fromForm(season.divs, season.teams);
        const schedule = Schedule.fromForm(season.nonDivWeeks, season.divWeeks);
        const matchupCreator = new MatchupCreator(league, schedule);
        matchupCreator.createMatchups();
        matchupCreator.showMatchups();
    } catch(error) {
        console.error(error);
        alert(error);
        throw error;
    }
}

// ENTRYPOINT
main
