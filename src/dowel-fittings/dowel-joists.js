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
    const { measureCenter } = lib.measurements

    const { constants, maths } = swLib.core;
    const { swDefaults } = swLib.core.standards;
    const { transform, superPrimitives } = swLib.utils;

    const defaultJoistSpecs = {
        tolerance: maths.inchesToMm(1 / 64),
        thicknessTyp: swDefaults.PANEL_THICKNESS_MD,
        thicknessSm: swDefaults.PANEL_THICKNESS_SM,
        joistFrameLength: maths.inchesToMm(1.5),
        jigSideMargin: maths.inchesToMm(3 / 16),
        jigBaseMargin: maths.inchesToMm(1 / 4),
    }

    const completeJoistSpecs = (initSpecs) => {
        const newSpecs = {
            ...initSpecs,
            diam: initSpecs.radius * 2,
        }

        // default type == 'i'
        let dowelPosHeight = newSpecs.height - newSpecs.diam
        let dowelPosWidth = 0
        let frameHeight = dowelPosHeight
        let frameWidth = newSpecs.thicknessTyp * 2 + newSpecs.diam

        if (newSpecs.type === 'rect') {
            dowelPosWidth = newSpecs.width - newSpecs.diam;
            frameHeight = newSpecs.thicknessTyp * -2 + newSpecs.height
            frameWidth = newSpecs.thicknessTyp * -2 + newSpecs.width
        }

        if (newSpecs.type === 'tri') {
            dowelPosWidth = 1 / constants.EQUI_TRIANGLE_HEIGHT_FACTOR * dowelPosHeight;
            frameWidth = dowelPosWidth
        }
        newSpecs.dowelPosHeight = dowelPosHeight
        newSpecs.dowelPosWidth = dowelPosWidth
        newSpecs.frameHeight = frameHeight
        newSpecs.frameWidth = frameWidth

        return newSpecs
    }

    const keyDowels = (joistSpecs) => {
        const outDowels = []
        const baseDowel = cylinder({
            radius: joistSpecs.radius + (joistSpecs.tolerance / 2),
            height: joistSpecs.joistFrameLength * 1.25
        })

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
                const vertOffset = (joistSpecs.frameWidth / 2 - (joistSpecs.frameHeight / 2)) / 2
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [0, joistSpecs.frameHeight / 2 + vertOffset, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / -2, joistSpecs.frameHeight / -2 + vertOffset, 0] },
                    baseDowel
                ))
                outDowels.push(align(
                    { modes: ['center', 'center', 'center'], relativeTo: [joistSpecs.frameWidth / 2, joistSpecs.frameHeight / -2 + vertOffset, 0] },
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

    const dowelJoistJigs = (joistSpecs) => {
        const dowelBoundaries = [
            joistSpecs.dowelPosWidth + joistSpecs.diam + joistSpecs.tolerance,
            joistSpecs.dowelPosHeight + joistSpecs.diam + joistSpecs.tolerance
        ]

        const cutoutHeight = dowelBoundaries[1] * constants.PHI_INV
        const holderHeight = joistSpecs.jigBaseMargin + cutoutHeight

        // defaults to 'i'
        const cutoutLowerWidth = dowelBoundaries[0]
        const cutoutUpperWidth = joistSpecs.type === 'tri' ? joistSpecs.diam : dowelBoundaries[0]

        const holderWidth = 2 * joistSpecs.jigSideMargin + dowelBoundaries[0]
        const holderWidthUpper = 2 * joistSpecs.jigSideMargin + cutoutUpperWidth
        const holderDepth = holderWidth * constants.PHI_INV
        const cutoutDepth = holderDepth * 1.5

        const basePlate = superPrimitives.meshPanel({
            size: [
                2 * joistSpecs.jigSideMargin + holderWidth,
                2 * joistSpecs.jigSideMargin + holderDepth,
                joistSpecs.thicknessTyp,
            ],
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeMargin: joistSpecs.thicknessTyp,
            patternMode: 'fill'
        });

        const jigHolderBlanks = {
            lower: cuboid({
                size: [
                    holderWidth,
                    holderDepth,
                    holderHeight,
                ]
            }), upper: cuboid({
                size: [
                    holderWidthUpper,
                    holderDepth,
                    holderHeight,
                ]
            })
        };

        const cutouts = {
            upper: cuboid({
                size: [
                    cutoutUpperWidth,
                    cutoutDepth,
                    cutoutHeight,
                ]
            }),
            lower: cuboid({
                size: [
                    cutoutLowerWidth,
                    cutoutDepth,
                    cutoutHeight,
                ]
            }),
        }

        const upperJigHolder = subtract(
            align({ modes: ['center', 'center', 'min'] }, jigHolderBlanks.upper),
            align({ modes: ['center', 'center', 'min'] }, cutouts.upper)
        )
        const lowerJigHolder = subtract(
            align({ modes: ['center', 'center', 'max'] }, jigHolderBlanks.lower),
            align({ modes: ['center', 'center', 'max'] }, cutouts.lower)
        )

        const output = {
            upperJig: union(
                align({ modes: ['center', 'center', 'max'] }, basePlate),
                align({ modes: ['center', 'center', 'max'] }, upperJigHolder)
            ),
            lowerJig: union(
                align({ modes: ['center', 'center', 'min'] }, basePlate),
                align({ modes: ['center', 'center', 'min'] }, lowerJigHolder)
            )
        }

        return output
    }

    /**
     * ...
     * @param {Object} opts 
     * @param {number} opts.dowelRadius 
     * @param {number} opts.height
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

        const offsetWidth = (joistSpecs.frameWidth - joistSpecs.thicknessTyp) / 2

        const joistCore = rotate([0, TAU / 4, 0], superPrimitives.meshPanel({
            size: [
                joistSpecs.joistFrameLength,
                joistSpecs.frameHeight,
                joistSpecs.thicknessTyp,
            ],
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeInsets: [offsetWidth, offsetWidth],
            edgeOffsets: [offsetWidth, offsetWidth],
        }));

        let joistFrame = joistCore

        const joist = subtract(joistFrame, ...dowels)

        const joistJigs = dowelJoistJigs(joistSpecs)

        return {
            joist,
            ...joistJigs,
        };
    }

    /**
     * ...
     * @param {Object} opts 
     * @param {number} opts.dowelRadius 
     * @param {number} opts.height
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
        const maxPanelWidth = joistSpecs.thicknessTyp * 2 + joistSpecs.diam

        const dowelSleeves = dowels.map((dowelGeom, dgIdx) => {
            let rot = [0, 0, TAU / 2]
            if (dgIdx === 1) {
                rot = [0, 0, TAU / -6]
            } else if (dgIdx === 2) {
                rot = [0, 0, TAU / 6]
            }

            const baseSleeve = cylinder({ radius: maxPanelWidth / 2, height: joistSpecs.joistFrameLength });
            const cutSleeve = transform.cutCircularSlice({ centralAngle: TAU / Math.PI }, baseSleeve)

            return translate(
                measureCenter(dowelGeom),
                rotate(rot, cutSleeve),
            )
        })

        const offsetWidth = (maxPanelWidth - joistSpecs.thicknessTyp) / 2
        const sizeFactor = (joistSpecs.thicknessTyp * -3 + joistSpecs.frameWidth) / joistSpecs.frameWidth

        const joistCorePanel = superPrimitives.meshPanel({
            size: [
                joistSpecs.frameWidth * sizeFactor,
                joistSpecs.joistFrameLength,
                joistSpecs.thicknessTyp,
            ],
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeInsets: [offsetWidth, offsetWidth],
        });

        const triHeight = joistSpecs.frameHeight / 2;
        const triHalfBase = joistSpecs.frameWidth / 4;

        const framePanels = [
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [0, triHeight * -sizeFactor, 0] },
                rotate([TAU / 4, 0, TAU / 2], joistCorePanel)
            ),
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [triHalfBase * sizeFactor, 0, 0] },
                rotate([TAU / 4, 0, TAU / -6], joistCorePanel)
            ),
            align(
                { modes: ['center', 'center', 'center'], relativeTo: [triHalfBase * -sizeFactor, 0, 0] },
                rotate([TAU / 4, 0, TAU / 6], joistCorePanel)
            ),
        ]

        let joistFrame = union(...framePanels, ...dowelSleeves)

        const joist = subtract(joistFrame, ...dowels)

        const joistJigs = dowelJoistJigs(joistSpecs)

        return {
            joist,
            ...joistJigs,
        };
    }

    /**
     * ...
     * @param {Object} opts 
     * @param {number} opts.dowelRadius 
     * @param {number} opts.height
     * @returns ...
     */
    const squareJoist = ({ dowelRadius, height }) => {
        const initSpecs = {
            ...defaultJoistSpecs,
            radius: dowelRadius,
            height,
            width: height,
            type: 'rect',
        }
        const joistSpecs = completeJoistSpecs(initSpecs)
        const dowels = keyDowels(joistSpecs)

        const joistCore = superPrimitives.meshCuboid({
            size: [joistSpecs.frameWidth, joistSpecs.frameHeight, joistSpecs.joistFrameLength],
            meshPanelThickness: joistSpecs.thicknessTyp,
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeInsets: [swDefaults.PANEL_THICKNESS_SM, swDefaults.PANEL_THICKNESS_SM],
            openTop: true,
            openBottom: true,
        })

        const crossPieceSize = [
            joistSpecs.frameWidth * Math.sqrt(2) - joistSpecs.diam,
            joistSpecs.joistFrameLength,
            joistSpecs.thicknessSm,
        ]
        const crossPiece = rotate([TAU / 4, 0, TAU / 8], superPrimitives.meshPanel({
            size: crossPieceSize,
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeInsets: [swDefaults.PANEL_THICKNESS_XS, swDefaults.PANEL_THICKNESS_XS],
            edgeOffsets: [swDefaults.PANEL_THICKNESS_XS, swDefaults.PANEL_THICKNESS_XS],
        }))

        let joistFrame = union(joistCore, crossPiece)

        const joist = subtract(joistFrame, ...dowels)

        const joistJigs = dowelJoistJigs(joistSpecs)

        return {
            joist,
            ...joistJigs,
        };
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
            meshPanelThickness: joistSpecs.thicknessTyp,
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeMargin: joistSpecs.thicknessTyp,
            edgeInsets: [swDefaults.PANEL_THICKNESS_SM, swDefaults.PANEL_THICKNESS_SM],
            openTop: true,
            openBottom: true,
        })

        const frameHypot = Math.hypot(joistSpecs.frameWidth, joistSpecs.frameHeight)
        const frameAngle = Math.atan2(joistSpecs.frameWidth, joistSpecs.frameHeight) - (TAU / 4)
        const crossPieceSize = [
            frameHypot - joistSpecs.diam,
            joistSpecs.joistFrameLength,
            joistSpecs.thicknessSm,
        ]
        const crossPiece = rotate([TAU / 4, 0, -frameAngle], superPrimitives.meshPanel({
            size: crossPieceSize,
            radius: joistSpecs.thicknessTyp,
            segments: 8,
            edgeInsets: [swDefaults.PANEL_THICKNESS_XS, swDefaults.PANEL_THICKNESS_XS],
            edgeOffsets: [swDefaults.PANEL_THICKNESS_XS, swDefaults.PANEL_THICKNESS_XS],
        }))

        let joistFrame = union(joistCore, crossPiece)

        const joist = subtract(joistFrame, ...dowels)

        const joistJigs = dowelJoistJigs(joistSpecs)

        return {
            joist,
            ...joistJigs,
        };
    }

    const output = {
        iJoist,
        triJoist,
        squareJoist,
        rectJoist,
    }

    return output;
}

module.exports = { init: dowelJoists }
