let boundFuncs = {};

self.addEventListener('message', function(event){
    
    if (event.data.action !== "runCommand") {
        // allow other types of messages if needed
        return;
    }
    
    let ret = (err, data) => {
        event.ports[0].postMessage([err, data]);
    }
   
    let {command, dataAsString} = event.data;
    
    let data = null;
    if (dataAsString) {
        data = JSON.parse(dataAsString);
    }
    
    if (!boundFuncs[command]) {
        console.warn(`Fired command ${command}, but no function was bound to it.`);
        return;
    }
    
    Promise.resolve(boundFuncs[command](data))
    .then((data) => {
        console.info(`Service worker replying to ${command}...`, data);
        event.ports[0].postMessage([null, data]);
    })
    .catch((err) => {
        console.error(`Service worker replying with error to ${command}...`, err);
        event.ports[0].postMessage([err.toString(), null]);  
    })
    
});

module.exports = {
    bind(command, func) {
        if (boundFuncs[command]) {
            throw new Error("Already have a function bound to " + command);
        }
        boundFuncs[command] = func;
    },
    unbind(command, func) {
        if (boundFuncs[command] !== func) {
            throw new Error(`Trying to unbind function from ${command} when it is not bound.`)
        }
        boundFuncs[command] = null;
    }
};