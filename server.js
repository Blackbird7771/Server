const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

let serverStatus = 'Idle'; // Default status

// Endpoint for Puppeteer to notify Tasker that it has finished a task
app.get('/notify-tasker', (req, res) => {
    const identifier = req.query.id;

    if (identifier) {
        serverStatus = 'Waiting for Tasker';  // Update status to wait for Tasker
        console.log('Script task completed, waiting for Tasker to proceed...');
        res.send('Server status updated to: Waiting for Tasker');
    } else {
        res.send('Invalid request');
    }
});

// Endpoint for Tasker to check server status
app.get('/check-server-status', (req, res) => {
    res.send(serverStatus);
});

// Endpoint for Tasker to notify the server after completing its task
app.get('/tasker-finished', (req, res) => {
    serverStatus = 'Tasker Finished';  // Update status to indicate Tasker is done
    console.log('Tasker has finished its task, script can now proceed...');
    res.send('Server status updated to: Tasker Finished');
});

// Endpoint for Puppeteer to check if Tasker has finished
app.get('/check-tasker-status', (req, res) => {
    if (serverStatus === 'Tasker Finished') {
        serverStatus = 'Idle';  // Reset status for the next cycle
        res.send('Tasker Finished');
    } else {
        res.send('Waiting for Tasker');
    }
});

// Start the server and listen on the specified port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
});
