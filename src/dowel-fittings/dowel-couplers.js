"use strict"

/**
 * ...
 * @namespace families.dowelFittings.dowelCouplers
 */

/**
 * ...
 * @param {*} param0 
 * @returns ...
 */
const dowelCouplers = ({ lib, swLib }) => {

    const { rectangle } = lib.primitives;
    const { lumber } = swLib.core.standards;

    const output = {
        jig: null,
    }

    return output;
}

module.exports = { init: dowelCouplers }
