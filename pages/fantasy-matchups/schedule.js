class Schedule {
    static createForm(nonDivWeeks, divWeeks) {
        let form = [`<form name="schedule">`];
        form.push("<label>Non-Divisional Weeks</label><br></br>");
        for (let i = 0; i < nonDivWeeks; i++){
            const week = `nondiv-week-${i}`;
            form.push(`<select name=${week} id="${week}">`);
            for (let j = 0; j < MAX_SEASONAL_GAMES; j++){
                form.push(`<option value='${j + 1}'>${j + 1}</option>`);
            }
            form.push("</select><br><br>");
        }

        form.push("<label>Divisional Weeks</label><br></br>");
        for (let i = 0; i < divWeeks; i++){
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

    static fromForm(nonDivWeeks, divWeeks) {
        Schedule.createForm()
        document.getElementById("schedule-submit").addEventListener("click", function(event) {
            event.preventDefault();
            // TODO: Add logic for parsing schedule form
        })
    }
}