# service-worker-command-bridge

A utility library to facilitate communication between a Service
Worker and web page client through Promises.

## Why?

Service Worker communication is message-based, which makes it
difficult to maintain a Promise-like flow when running a command inside the
worker and parsing the result inside the web client.

## How do I use it?

There are two main files - `service-worker.js` and `client.js`.
You should require them on the two separate JS contexts. Then
you can use it like so:

*In Service Worker*
    
    const swBridge = require("service-worker-command-bridge/service-worker");
    
    swBridge.bind("test-command", (data) => {
        
        // this is a promise, so you can return a value
        // or return a Promise chain.
        
        return data.startNumber * 10;
    })
    
*In client*

    const runServiceWorkerCommand = require("service-worker-command-bridge/client");
    
    runServiceWorkerCommand("test-command", {
        startNumber: 10
    })
    .then((endNumber) => {
        console.log(endNumber); // = 100
    })