import { toRegExp } from '../helpers/string-utils';
import { hit } from '../helpers';

/**
 * Adjusts timeout for specified setTimout() callbacks.
 * @param {Source} source
 * @param {string|RegExp} match matching in string of callback function
 * @param {string|number} timeout matching timeout
 * @param {string|number} boost timeout multiplier
 */
export function adjustSetTimeout(source, match, timeout, boost) {
    const nativeTimeout = window.setTimeout;
    timeout = parseInt(timeout, 10);
    timeout = Number.isNaN(timeout) ? 1000 : timeout;

    boost = parseInt(boost, 10);
    boost = Number.isNaN(timeout) || !Number.isFinite(boost) ? 0.05 : boost;

    match = match ? toRegExp(match) : toRegExp('/.?/');

    if (boost < 0.02) {
        boost = 0.02;
    }
    if (boost > 50) {
        boost = 50;
    }

    const timeoutWrapper = (cb, d, ...args) => {
        if (d === timeout && match.test(cb.toString())) {
            d *= boost;
            hit(source);
        }
        return nativeTimeout.apply(window, [cb, d, ...args]);
    };
    window.setTimeout = timeoutWrapper;
}

adjustSetTimeout.names = [
    'adjust-setTimeout',
    'ubo-nano-setTimeout-booster.js',
];

adjustSetTimeout.injections = [toRegExp, hit];