"use strict"

/**
 * Families
 * @namespace families
 */

const init = ({ lib, swLib }) => {
    const families = {
        brickNorthAmerica: require('./brick-na').init({ lib, swLib }),
        lumberNorthAmerica: require('./lumber-na').init({ lib, swLib }),
        tileNorthAmerica: require('./tile-na').init({ lib, swLib }),
        trimAranea: require('./trim-aranea').init({ lib, swLib }),
    }

    return families;
}

module.exports = { init };
