module.exports = function (command, data) {
    
    // Wrap our postMessage in a promise to allow us to chain commands and
    // responses together.
    return new Promise((fulfill, reject) => {
        let messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            console.log(`Received response to ${command}...`)
            let [err, data] = event.data;
            if (err) {
                return reject(err);
            }
            
            // messageChannel.port1.close();
            fulfill(data);
        };
        
        navigator.serviceWorker.ready.then((reg) => {
            console.info(`Sending ${command} to service worker...`, data);
            reg.active.postMessage({
                action: "runCommand",
                command,
                data
            }, [messageChannel.port2]);
        })
        
    })
}
if (typeof window !== "undefined") {
window.runServiceWorkerCommand = module.exports;
}
