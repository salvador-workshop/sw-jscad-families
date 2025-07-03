"use strict"

/**
 * ...
 * @namespace families.lumber.northAmerica
 */

const lumberNorthAmerica = ({ lib, swLib }) => {

    const { lumber } = swLib.core.standards;
    console.log(lumber)

    return {
        lumber,
    }
}

module.exports = { init: lumberNorthAmerica }
