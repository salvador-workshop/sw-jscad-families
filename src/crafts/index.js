"use strict"

/**
 * ...
 * @namespace families.crafts
 */

const init = ({ lib, swLib }) => {
    const { rectangle, cuboid, triangle, circle, cylinder, roundedRectangle } = lib.primitives;
    const { union, subtract } = lib.booleans;
    const { translate, align, mirror, rotate } = lib.transforms;
    const { hull } = lib.hulls
    const { extrudeLinear, extrudeRotate } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { superPrimitives } = swLib.utils;
    const { transform } = swLib.utils;
    const { standards, maths, position } = swLib.core

    const toothpickSpecs = {
        radius: standards.crafts.DIAM_TOOTHPICK / 2,
        length: maths.inchesToMm(4),
        pointLength: maths.inchesToMm(1 / 4),
    }

    const bbqSkewerSpecs = {
        radius: standards.crafts.DIAM_BBQ_SKEWER / 2,
        length: maths.inchesToMm(12),
        pointLength: maths.inchesToMm(0.5),
    }

    const popsicleStickSpecs = {
        width: standards.crafts.POPSICLE_STICK_WIDTH,
        thickness: standards.crafts.POPSICLE_STICK_THICKNESS,
        length: standards.crafts.POPSICLE_STICK_LENGTH,
        endRadius: standards.crafts.POPSICLE_STICK_WIDTH / 2,
    }

    const crafts = {
        toothpick: ({
            radius = toothpickSpecs.radius,
            length = toothpickSpecs.length,
            pointLength = toothpickSpecs.pointLength
        }) => {
            const core2d = rectangle({ size: [pointLength * -2 + length, radius * 2] })
            const core2dCoords = position.getGeomCoords(core2d)
            const point2d1 = align({ modes: ['max', 'center', 'center'], relativeTo: [core2dCoords.left, 0, 0] }, triangle())
            const point2d2 = align({ modes: ['min', 'center', 'center'], relativeTo: [core2dCoords.right, 0, 0] }, triangle())
            const baseShape = rotate([0, 0, TAU / 4], union(core2d, point2d1, point2d2))

            return {
                geom2: baseShape,
                geom3: extrudeRotate({ segments: 12 }, baseShape),
            }
        },
        bbqSkewer: ({
            radius = bbqSkewerSpecs.radius,
            length = bbqSkewerSpecs.length,
            pointLength = bbqSkewerSpecs.pointLength
        }) => {
            const core2d = rectangle({ size: [length - pointLength, radius * 2] })
            const core2dCoords = position.getGeomCoords(core2d)
            const point2d = align({ modes: ['min', 'center', 'center'], relativeTo: [core2dCoords.right, 0, 0] }, triangle())
            const baseShape = rotate([0, 0, TAU / 4], union(core2d, point2d))

            return {
                geom2: baseShape,
                geom3: extrudeRotate({ segments: 12 }, baseShape),
            }
        },
        popsicleStick: ({
            width = popsicleStickSpecs.width,
            thickness = popsicleStickSpecs.thickness,
            length = popsicleStickSpecs.length,
            endRadius = popsicleStickSpecs.endRadius
        }) => {
            const ends = [
                align(
                    { modes: ['min', 'center', 'center'], relativeTo: [length / -2, 0, 0] },
                    roundedRectangle({ size: [width, width], roundRadius: endRadius - 0.01 })
                ),
                align(
                    { modes: ['max', 'center', 'center'], relativeTo: [length / 2, 0, 0] },
                    roundedRectangle({ size: [width, width], roundRadius: endRadius - 0.01 })
                ),
            ]
            const baseShape = hull(ends)

            return {
                geom2: baseShape,
                geom3: extrudeLinear({ height: thickness }, baseShape),
            }
        },
    }

    return crafts;
}

module.exports = { init };
