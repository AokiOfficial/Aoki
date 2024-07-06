class Event {
  constructor(name, once = false) {
    this.name = name;
    this.once = once;
  }
  /**
   * Execute the event
   * @param {Object} i Interaction object
   */
  async execute(...args) {
    throw new Error('Execute method not implemented');
  }
}

export default Event;
