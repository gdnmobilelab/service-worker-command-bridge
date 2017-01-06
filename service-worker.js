let boundFuncs = {};

self.addEventListener('message', function(event){
    
    if (event.data.action !== "runCommand") {
        // allow other types of messages if needed
        return;
    }

    
    let ret = (err, data) => {
        event.ports[0].postMessage([err, data]);
    }
   
    let {command, data} = event.data;

    console.info(`Service worker received ${command}`)

    module.exports.run(command, data)
    .then((data) => {
        console.info(`Service worker replying to ${command}...`);
        event.ports[0].postMessage([null, data]);
    })
    .catch((err) => {
        console.error(`Service worker replying with error to ${command}...`, err.message);
        event.ports[0].postMessage([err.toString(), null]);  
    })
    .then(() => {
        try {
            event.ports[0].close()
        } catch (err) {
            console.error("Could not close port")
        }
    })
    
});

module.exports = {
    bind(command, func) {
        if (boundFuncs[command]) {
            throw new Error("Already have a function bound to " + command);
        }
        boundFuncs[command] = func;
    },
    bindAll(obj) {
        for (key in obj) {
            module.exports.bind(key, obj[key]);
        }
    },
    unbind(command, func) {
        if (boundFuncs[command] !== func) {
            throw new Error(`Trying to unbind function from ${command} when it is not bound.`)
        }
        boundFuncs[command] = null;
    },
    run(command, data) {
        if (!boundFuncs[command]) {
            throw new Error("Tried to execute " + command + ", but it is not bound");
        }

        return Promise.resolve(boundFuncs[command](data))
    }
};