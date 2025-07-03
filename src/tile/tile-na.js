"use strict"

/**
 * ...
 * @namespace families.tile.northAmerica
 */

const tileNorthAmerica = ({ lib, swLib }) => {

    const { tiles } = swLib.core.standards;
    console.log(tiles)

    return {
        tiles,
    }
}

module.exports = { init: tileNorthAmerica }
