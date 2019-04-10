/* eslint-disable no-console */
import { stringToFunc } from '../helpers';

/**
 * Logs add event listener calls
 *
 * @param {Source} source
 */
export function logAddEventListener(source) {
    const hit = stringToFunc(source.hit);
    const log = console.log.bind(console);
    const nativeAddEventListener = window.EventTarget.prototype.addEventListener;
    function addEventListenerWrapper(eventName, callback, ...args) {
        log(`addEventListener("${eventName}", ${callback.toString()})`);
        hit();
        return nativeAddEventListener.apply(this, [eventName, callback, ...args]);
    }
    window.EventTarget.prototype.addEventListener = addEventListenerWrapper;
}

logAddEventListener.names = [
    'log-addEventListener',
    'addEventListener-logger.js',
];

logAddEventListener.injections = [stringToFunc];
