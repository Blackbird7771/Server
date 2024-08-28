const express = require('express');
const app = express();

// Use the PORT environment variable provided by Adaptable.io, or default to 8080 for local testing
const port = process.env.PORT || 8080;

let lastIdentifier = null;
let taskerReady = false;

// Endpoint for script to notify Tasker with a unique identifier
app.get('/notify-tasker', (req, res) => {
    const identifier = req.query.id;

    if (identifier && identifier !== lastIdentifier) {
        lastIdentifier = identifier;  // Update the last processed identifier
        taskerReady = false;  // Reset Tasker status
        console.log('Script finished its task, notified Tasker with new identifier:', identifier);
        res.send('Tasker will proceed with new task');
    } else {
        res.send('No new task for Tasker');
    }
});

// Endpoint for Tasker to notify script after completing the task
app.get('/tasker-response', (req, res) => {
    taskerReady = true;
    console.log('Tasker completed its task');
    res.send('Script can proceed');
});

// Endpoint for Tasker to check if the script is done
app.get('/check-tasker-status', (req, res) => {
    if (taskerReady) {
        res.send('Tasker is ready');
    } else {
        res.send('Tasker not ready');
    }
});

// Endpoint for script to check if Tasker is done
app.get('/check-script-status', (req, res) => {
    if (taskerReady) {
        res.send('Tasker is done');
    } else {
        res.send('Tasker still working');
    }
});

// Start the server and listen on the specified port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
});
