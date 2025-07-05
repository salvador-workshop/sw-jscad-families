"use strict"

/**
 * ...
 * @namespace families.dowelFittings.dowelJoists
 */

/**
 * ...
 * @param {*} param0 
 * @returns ...
 */
const dowelJoists = ({ lib, swLib }) => {
    const { circle, cylinder, cuboid } = lib.primitives;
    const { subtract, union } = lib.booleans;
    const { align, rotate, mirror, translate } = lib.transforms;

    const { constants } = swLib.core;
    const { swDefaults } = swLib.core.standards;
    const { superPrimitives } = swLib.utils;

    const defaultJoistSpecs = {
        typThickness: swDefaults.PANEL_THICKNESS_MD,
    }

    const completeJoistSpecs = (initSpecs) => {
        const newSpecs = {
            ...initSpecs,
            diam: initSpecs.radius * 2,
            dowelPosHeight: initSpecs.height - initSpecs.diam,
        }

        // default type == 'i'
        let dowelPosWidth = 0
        let frameHeight = newSpecs.dowelPosHeight
        let frameWidth = initSpecs.typThickness * 2 + initSpecs.diam

        if (initSpecs.type === 'rect') {
            dowelPosWidth = initSpecs.width - initSpecs.diam;
            frameHeight = initSpecs.typThickness * -2 + initSpecs.height
            frameWidth = initSpecs.typThickness * -2 + initSpecs.width
        }

        if (initSpecs.type === 'tri') {
            dowelPosWidth = 1 / constants.EQUI_TRIANGLE_HEIGHT_FACTOR * newSpecs.dowelPosHeight;
            frameWidth = dowelPosWidth
        }
        newSpecs.dowelPosWidth = dowelPosWidth
        newSpecs.frameHeight = frameHeight
        newSpecs.frameWidth = frameWidth

        return newSpecs
    }

    const keyDowels = (joistSpecs) => {
        const outDowels = []
        const baseDowel = cylinder({ radius: joistSpecs.radius, height: 20 })

        switch (joistSpecs.type) {
            case 'rect':
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                break;
            case 'tri':
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                break;
            default:
                // defaults to 'i'
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                    baseDowel
                ))
                break;
        }

        return outDowels
    }

    /**
     * ...
     * @param {Object} opts 
     * @param {number} opts.dowelRadius 
     * @returns ...
     */
    const iJoist = ({ dowelRadius, height }) => {
        const initSpecs = {
            ...defaultJoistSpecs,
            radius: dowelRadius,
            height,
            type: 'i',
        }
        const joistSpecs = completeJoistSpecs(initSpecs)
        const dowels = keyDowels(joistSpecs)

        const offsetWidth = (joistSpecs.frameWidth - joistSpecs.typThickness) / 2

        const joistCore = superPrimitives.meshPanel({
            size: [
                30,
                joistSpecs.frameHeight,
                joistSpecs.typThickness,
            ],
            radius: joistSpecs.typThickness,
            segments: 8,
            edgeMargin: joistSpecs.typThickness,
            edgeInsets: [offsetWidth, offsetWidth],
            edgeOffsets: [offsetWidth, offsetWidth],
        });

        let joistFrame = joistCore

        const joist = subtract(joistFrame, ...dowels)

        return joist;
    }

    /**
     * ...
     * @param {Object} opts 
     * @param {number} opts.dowelRadius 
     * @returns ...
     */
    const triJoist = ({ dowelRadius, height }) => {
        const initSpecs = {
            ...defaultJoistSpecs,
            radius: dowelRadius,
            height,
            type: 'tri',
        }
        const joistSpecs = completeJoistSpecs(initSpecs)
        const dowels = keyDowels(joistSpecs)

        const maxPanelWidth = joistSpecs.typThickness * 2 + joistSpecs.diam
        const offsetWidth = (maxPanelWidth - joistSpecs.typThickness) / 2

        const joistCorePanel = superPrimitives.meshPanel({
            size: [
                joistSpecs.frameWidth,
                30,
                joistSpecs.typThickness,
            ],
            radius: joistSpecs.typThickness,
            segments: 8,
            edgeMargin: joistSpecs.typThickness,
            edgeInsets: [offsetWidth, offsetWidth],
            edgeOffsets: [offsetWidth, offsetWidth],
        });

        const framePanels = [
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                rotate([0, 0, 0], joistCorePanel)
            ),
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                rotate([0, 0, 0], joistCorePanel)
            ),
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [0, 0, 0] },
                rotate([0, 0, 0], joistCorePanel)
            ),
        ]

        let joistFrame = union(...framePanels)

        const joist = subtract(joistFrame, ...dowels)

        return joist;
    }

    /**
     * ...
     * @param {Object} opts 
     * @param {number} opts.dowelRadius 
     * @param {number[]} opts.size - [height, width]
     * @returns ...
     */
    const rectJoist = ({ dowelRadius, size }) => {
        const initSpecs = {
            ...defaultJoistSpecs,
            radius: dowelRadius,
            height: size[0],
            width: size[1],
            type: 'rect',
        }
        const joistSpecs = completeJoistSpecs(initSpecs)
        const dowels = keyDowels(joistSpecs)

        const joistCore = superPrimitives.meshCuboid({
            size: [joistSpecs.frameWidth, joistSpecs.frameHeight, 30],
            meshPanelThickness: joistSpecs.typThickness,
            radius: joistSpecs.typThickness,
            segments: 8,
            edgeInsets: [swDefaults.PANEL_THICKNESS_SM, swDefaults.PANEL_THICKNESS_SM]
        })


        let joistFrame = joistCore

        const joist = subtract(joistFrame, ...dowels)

        return joist;
    }

    const output = {
        iJoist,
        triJoist,
        rectJoist,
    }

    return output;
}

module.exports = { init: dowelJoists }
