//main source of events
export const Signals = {
    splashIsDone: "0",
    errorInReactPlayer: "1"
}
Object.freeze(Signals);

/**
 * - This function helps to communicate between components
 * @function EventEmitter
 */
export const EventEmitter = {
    events: {},
    emit: function (event, data) {
        //if event doesn't exist then don't call
        if (!this.events[event]) return;
        //call the event
        this.events[event].forEach(callback => callback(data));
    },
    on: function (event, callback) {
        //if event doesn't exist in events then add it
        if (!this.events[event]) {
            this.events[event] = [];
        }
        //add the event to its type
        this.events[event].push(callback);
    },
    once: function (event, callback) {
        this.on(event, ()=>{
            callback()
            this.removeListener(event);
        });
    },
    removeListener: function (event) {
        if (!this.events[event]) {
            console.error(`Event with name ${event} doesn't exist`);
            return;
        }

        delete this.events[event];
    }
}
