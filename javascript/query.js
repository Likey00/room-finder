function processForm(e) {
    if (e.preventDefault) e.preventDefault();

    const dayElement = document.getElementById('day');
    const startElement = document.getElementById('start');
    const endElement = document.getElementById('end');

    let day = dayElement.value, start = startElement.value, end = endElement.value;
    if (start == "") start = "00:00";
    if (end == "") end = "23:59";
    
    start = timeToMins(start);
    end = timeToMins(end);
    
    if (start > end) {
        document.getElementById('results').innerHTML = "<h3>Invalid Time Range</h3>";
        return;
    }

    results = {}
    for (let d of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
        for (let campus in rooms[d]) {
            if (!(campus in results)) results[campus] = {};

        }
    }
    for (let campus in rooms) {
        results[campus] = {};
        for (let building in rooms[campus]) {
            results[campus][building] = []
            for (let roomNum in rooms[campus][building]) {
                if (!(day in rooms[campus][building][roomNum])) {
                    results[campus][building].push(roomNum);
                    continue;
                }
                let available = true;
                for (let [s, e] of rooms[campus][building][roomNum][day]) {
                    if (Math.max(start, s) <= Math.min(end, e)) {
                        available = false;
                        break;
                    }
                }
                if (!available) continue;
                results[campus][building].push(roomNum);
            }
            if (results[campus][building].length == 0) delete results[campus][building];
        }
        if (Object.keys(results[campus]).length == 0) delete results[campus];
    }

    if (Object.keys(results).length == 0) {
        document.getElementById('results').innerHTML = "<h3>No rooms open in this time range</h3>";
        return;
    }

    resultArr = [];
    for (let campus in results) {
        resultArr.push('<h3>' + campus + '</h3>');
        resultArr.push('<ul>');

        for (let building in results[campus]) {
            resultArr.push('<li><strong>' + building + ':</strong> ' + results[campus][building].join(', ') + '</li>');
        }

        resultArr.push('</ul>');
    }

    document.getElementById('results').innerHTML = resultArr.join('\n');
    return false;
}

function timeToMins(time) {
    time = time.split(':');
    return parseInt(time[0])*60 + parseInt(time[1]);
}

function init() {
    const form = document.getElementById('form');
    console.log(form);
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);
    } else {
        form.addEventListener("submit", processForm);
    }
}

window.onload = init;