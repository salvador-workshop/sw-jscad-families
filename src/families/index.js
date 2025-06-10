"use strict"

/**
 * Families
 * @namespace families
 */

const init = ({ lib, swLib }) => {
    const families = {
        trimAranea: require('./trim-aranea').init({ lib, swLib }),
    }

    return families;
}

module.exports = { init };
