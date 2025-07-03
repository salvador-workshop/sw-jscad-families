"use strict"

const brickModule = require('./brick');
const lumberModule = require('./lumber');
const tileModule = require('./tile');
const trimModule = require('./trim');

const init = ({ lib, swLib }) => {
    return {
        brick: brickModule.init({ lib, swLib }),
        lumber: lumberModule.init({ lib, swLib }),
        tile: tileModule.init({ lib, swLib }),
        trim: trimModule.init({ lib, swLib }),
    }
}

module.exports = { init };
