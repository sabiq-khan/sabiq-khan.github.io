import { Season } from './season.mjs'
import { League } from './league.mjs'
import { Schedule } from './schedule.mjs'
import { MatchupCreator } from './matchups.mjs'

function main() {
    try {
        // TODO: Fix race condition for Season instantiation
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
main()
