"use strict"

const brickModule = require('./brick');
const lumberModule = require('./lumber');
const tileModule = require('./tile');
const trimModule = require('./trim');
const dowelFittingsModule = require('./dowel-fittings');

const init = ({ lib, swLib }) => {
    return {
        brick: brickModule.init({ lib, swLib }),
        dowelFittings: dowelFittingsModule.init({ lib, swLib }),
        lumber: lumberModule.init({ lib, swLib }),
        tile: tileModule.init({ lib, swLib }),
        trim: trimModule.init({ lib, swLib }),
    }
}

module.exports = { init };
