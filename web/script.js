// My_Time - A simple time synchronisation web app
// Author: Steve-Tech

// Set this to the URL of the My_Time server
const server = "/sync";

let useWebsocket = true && 'WebSocket' in window;
const doubleTry = true; // Usually faster on the second request
// Variables used by the WebSocket sync
let socket;
let wantSync = false;

if (useWebsocket) {
    socket = new WebSocket(`${window.location.protocol.replace(/^http/, 'ws')}//${window.location.host}/ws`);

    socket.addEventListener("open", () => {
        if (wantSync) {
            wantSync = false;
            syncWS();
            if (doubleTry)
                setTimeout(syncWS, 1000);
        }
    });

    socket.addEventListener("error", () => {
        console.error("WebSocket error fallback to HTTP sync");
        useWebsocket = false;
    });

    socket.addEventListener("message", (event) => {
        t4 = new Date().getTime() / 1000;
        let data = JSON.parse(event.data);
        updateClock(data['t1'], data['t2'], data['t3'], t4);
    });
}

// Variable used by the updateClock() function to adjust the time
let adjustment = 0;

function updateClock(t1, t2, t3, t4) {
    let theta = ((t2 - t1) + (t3 - t4)) / 2;
    let delay = (t4 - t1) - (t3 - t2);

    adjustment = theta;
    let absolute = Math.abs(theta);
    let rounded = Math.round(absolute * 1000) / 1000;
    let how = `${theta > 0 ? "behind" : "ahead"}`
    document.getElementById("difference").innerHTML = "Your clock is " +
        (rounded === 0 ? `<abbr title="${absolute} seconds ${how}">exactly</abbr> in sync.` : `<abbr title="${absolute} seconds ${how}">${rounded}</abbr> seconds ${how}.`);
    document.getElementById("latency").innerText = Math.round(delay * 1000);
}

function syncHTTP() {
    document.getElementById("difference").innerText = "Synchronizing...";
    document.getElementById("latency").innerText = "--";

    // HEAD request to open connection for reliable timing
    fetch(server, { method: 'HEAD' }).finally(() => {
        let t4;
        let t1 = new Date();
        // Make the actual sync request
        fetch(server)
            .then((response) => {
                // Get accurate t4
                t4 = new Date().getTime() / 1000;
                // Fix up t1
                t1 = t1.getTime() / 1000;
                // Return the response for the next .then()
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                updateClock(t1, data['t2'], data['t3'], t4);
            });
    });
}

function syncWS() {
    if (socket.readyState === WebSocket.OPEN) {
        document.getElementById("difference").innerText = "Synchronizing...";
        document.getElementById("latency").innerText = "--";
        t1 = new Date().getTime() / 1000;
        socket.send(t1);
    } else {
        wantSync = true;
    }
}

function sync() {
    return useWebsocket ? syncWS() : syncHTTP();
}

function minute(time) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    document.getElementById("date").innerText = `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()}, week ${Math.ceil(Math.floor((time - new Date(time.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)) / 7)}.`;
    sync();
}

function second() {
    let time = new Date(new Date().getTime() - adjustment);
    setTimeout(second, 1001 - time.getMilliseconds()); // 1000 + 1 to prevent early calls
    document.getElementById("time").innerText = time.toLocaleTimeString('en-AU', { hour12: false });
    if (time.getSeconds() == 0) {
        minute(time);
    }
}

second();
minute(new Date());