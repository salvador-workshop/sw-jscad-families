"use strict"

/**
 * ...
 * @namespace families.paper
 */

const init = ({ lib, swLib }) => {
    const { rectangle, cuboid, triangle, circle, cylinder, roundedRectangle } = lib.primitives;
    const { union, subtract } = lib.booleans;
    const { translate, align, mirror, rotate } = lib.transforms;
    const { hull } = lib.hulls
    const { extrudeLinear, extrudeRotate } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { standards, maths, position } = swLib.core

    // TODO - move to std-specs lib
    const camelCase = (str) => {
        // Using replace method with regEx
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    const metric = {}
    Object.entries(standards.paper.metric).forEach(([key, val]) => {
        const newKey = camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        metric[newKey] = rectangle({ size: val })
    })

    const imperial = {}
    const ansi = {}
    const arch = {}
    Object.entries(standards.paper.imperial).forEach(([key, val]) => {
        if (key === 'ansi') {
            Object.entries(val).forEach(([aKey, aVal]) => {
                const ansiKey = camelCase(aKey.replaceAll('_', ' ').toLocaleLowerCase())
                ansi[ansiKey] = rectangle({ size: aVal })
            })
        } else if (key === 'arch') {
            Object.entries(val).forEach(([arKey, arVal]) => {
                const archKey = camelCase(arKey.replaceAll('_', ' ').toLocaleLowerCase())
                arch[archKey] = rectangle({ size: arVal })
            })
        } else {
            const newKey = camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
            imperial[newKey] = rectangle({ size: val })
        }
    })

    const cards = {}
    Object.entries(standards.paper.cards).forEach(([key, val]) => {
        const newKey = camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        cards[newKey] = rectangle({ size: val })
    })

    const bookmarks = {}
    Object.entries(standards.paper.bookmarks).forEach(([key, val]) => {
        const newKey = camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        bookmarks[newKey] = rectangle({ size: val })
    })

    const poster = {}
    Object.entries(standards.paper.poster).forEach(([key, val]) => {
        const newKey = camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        poster[newKey] = rectangle({ size: val })
    })

    const photos = {}
    Object.entries(standards.paper.photos).forEach(([key, val]) => {
        const newKey = camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        photos[newKey] = rectangle({ size: val })
    })

    const paper = {
        metric,
        ansi,
        arch,
        imperial,
        cards,
        bookmarks,
        poster,
        photos,
    }

    return paper;
}

module.exports = { init };
