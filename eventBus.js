const EventEmitter = {
    events: {},
    on(event, callback) {
      this.events[event] = this.events[event] || [];
      this.events[event].push(callback);
    },
    emit(event, data) {
      this.events[event]?.forEach(callback => callback(data));
    }
  };
  
  export default EventEmitter;