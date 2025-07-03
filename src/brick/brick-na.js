"use strict"

/**
 * ...
 * @namespace families.brick.northAmerica
 */

const brickNorthAmerica = ({ lib, swLib }) => {

    const { masonry } = swLib.core.standards;
    console.log(masonry)

    return {
        masonry,
    }
}

module.exports = { init: brickNorthAmerica }
