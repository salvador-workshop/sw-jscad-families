"use strict"

/**
 * ...
 * @namespace families.dowelFittings
 */

const init = ({ lib, swLib }) => {
    const dowelFittings = {
        jigs: require('./dowel-jigs').init({ lib, swLib }),
        couplers: require('./dowel-couplers').init({ lib, swLib }),
    }

    return dowelFittings;
}

module.exports = { init };
