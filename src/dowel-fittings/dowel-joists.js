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
    const { TAU } = lib.maths.constants

    const { constants, maths } = swLib.core;
    const { swDefaults } = swLib.core.standards;
    const { superPrimitives } = swLib.utils;

    const defaultJoistSpecs = {
        typThickness: swDefaults.PANEL_THICKNESS_MD,
        joistFrameLength: maths.inchesToMm(1.5),
    }

    const completeJoistSpecs = (initSpecs) => {
        console.log(initSpecs)
        const newSpecs = {
            ...initSpecs,
            diam: initSpecs.radius * 2,
        }

        // default type == 'i'
        let dowelPosHeight = newSpecs.height - newSpecs.diam
        let dowelPosWidth = 0
        let frameHeight = dowelPosHeight
        let frameWidth = newSpecs.typThickness * 2 + newSpecs.diam

        if (newSpecs.type === 'rect') {
            dowelPosWidth = newSpecs.width - newSpecs.diam;
            frameHeight = newSpecs.typThickness * -2 + newSpecs.height
            frameWidth = newSpecs.typThickness * -2 + newSpecs.width
        }

        if (newSpecs.type === 'tri') {
            dowelPosWidth = 1 / constants.EQUI_TRIANGLE_HEIGHT_FACTOR * dowelPosHeight;
            frameWidth = dowelPosWidth
        }
        newSpecs.dowelPosHeight = dowelPosHeight
        newSpecs.dowelPosWidth = dowelPosWidth
        newSpecs.frameHeight = frameHeight
        newSpecs.frameWidth = frameWidth

        console.log(newSpecs)
        return newSpecs
    }

    const keyDowels = (joistSpecs) => {
        const outDowels = []
        const baseDowel = cylinder({ radius: joistSpecs.radius, height: joistSpecs.joistFrameLength * 1.25 })

        switch (joistSpecs.type) {
            case 'rect':
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / 2, joistSpecs.frameHeight / 2, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / -2, joistSpecs.frameHeight / 2, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / 2, joistSpecs.frameHeight / -2, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / -2, joistSpecs.frameHeight / -2, 0] },
                    baseDowel
                ))
                break;
            case 'tri':
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, joistSpecs.frameHeight / 2, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / -2, joistSpecs.frameHeight / -2, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / 2, joistSpecs.frameHeight / -2, 0] },
                    baseDowel
                ))
                break;
            default:
                // defaults to 'i'
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, joistSpecs.frameHeight / 2, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, joistSpecs.frameHeight / -2, 0] },
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

        const joistCore = rotate([0, TAU / 4, 0], superPrimitives.meshPanel({
            size: [
                joistSpecs.joistFrameLength,
                joistSpecs.frameHeight,
                joistSpecs.typThickness,
            ],
            radius: joistSpecs.typThickness,
            segments: 8,
            edgeInsets: [offsetWidth, offsetWidth],
            edgeOffsets: [offsetWidth, offsetWidth],
        }));

        let joistFrame = joistCore

        const joist = union(joistFrame, ...dowels)

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
                joistSpecs.joistFrameLength,
                joistSpecs.typThickness,
            ],
            radius: joistSpecs.typThickness,
            segments: 8,
            edgeInsets: [offsetWidth, offsetWidth],
        });

        const framePanels = [
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [0, joistSpecs.frameHeight / -2, 0] },
                rotate([TAU / 4, 0, TAU / 2], joistCorePanel)
            ),
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / 4, 0, 0] },
                rotate([TAU / 4, 0, TAU / -6], joistCorePanel)
            ),
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / -4, 0, 0] },
                rotate([TAU / 4, 0, TAU / 6], joistCorePanel)
            ),
        ]

        let joistFrame = union(...framePanels)

        const joist = union(joistFrame, ...dowels)

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
            size: [joistSpecs.frameWidth, joistSpecs.frameHeight, joistSpecs.joistFrameLength],
            meshPanelThickness: joistSpecs.typThickness,
            radius: joistSpecs.typThickness,
            segments: 8,
            edgeInsets: [swDefaults.PANEL_THICKNESS_SM, swDefaults.PANEL_THICKNESS_SM],
            openTop: true,
            openBottom: true,
        })


        let joistFrame = joistCore

        const joist = union(joistFrame, ...dowels)

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
