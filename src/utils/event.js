export default class Event {
    constructor(key, listener) {
        this.listener = (storageEvent) => {
            if (key === storageEvent.key) {
                listener(storageEvent);
            }
        }
        window.addEventListener('storage', this.listener);
    }

    remove() {
        window.removeEventListener('storage', this.listener);
    }

}
