import {DiffRow, KeyValue, OsmObject, SourcePoint, Validator} from "../types";

const matchOsm = (item: any, osmObjects: OsmObject[], refKey: string, distance?: number): OsmObject | undefined => {
    let matchedOsmObject: OsmObject | undefined
    osmObjects.forEach((osmObject: OsmObject) => {
        if (osmObject.tags.ref && item[refKey]) {
            if (osmObject.tags.ref == item[refKey]) {
                matchedOsmObject = osmObject
            }
            return
        }
        const x: number = osmObject.lon - item.position.longitude
        const y: number = osmObject.lat - item.position.latitude
        if (x ** 2 + y ** 2 < (distance || 10 / 111139) ** 2) {
            matchedOsmObject = osmObject
            return
        }
    })
    return matchedOsmObject
}

const getByKey = (item: any, key: string): any | undefined => {
    const keyParts: string[] = key.split('.')
    let data: any = item
    for (const k in keyParts) {
        const keyPart: string = keyParts[k]
        data = data?.[keyPart]
    }
    return data
}

const getMappedValues = (item: any, config: Validator): KeyValue => {
    const mappedValues: KeyValue = [];
    for (const key in config.mapping) {
        if (key.startsWith('_')) {
            continue
        }
        mappedValues[key] = getByKey(item, config.mapping[key])
    }
    for (const key in config.extra) {
        mappedValues[key] = config.extra[key]
    }
    return mappedValues
}

const getDiff = (sourceData: KeyValue, osmData: KeyValue) => {
    const out = {
        newCount: 0,
        diffCount: 0,
        sameCount: 0,
    }

    Object.keys(sourceData).map(key => {
        if (key.startsWith('_') || key == 'source_ref') {
            return
        }

        if (osmData[key] === undefined) {
            out.newCount++
        } else if (sourceData[key] == osmData[key]) {
            out.sameCount++
        } else {
            out.diffCount++
        }
    })

    return out
}

const getDiffTable = (point: SourcePoint): DiffRow[] => {
    return Object.keys(point.mappedData || {}).map((key: string): DiffRow | undefined => {
        if (key.startsWith('_')) {
            return undefined
        }

        const sourceValue = point.mappedData?.[key]
        const osmValue = point.osm?.tags?.[key]

        let color: string = 'light'
        if (osmValue === undefined) {
            color = 'info'
        } else if (sourceValue != osmValue) {
            color = 'warning'
        }
        return {
            key,
            sourceValue,
            sourceLink: getValueLink(key, sourceValue),
            osmValue,
            osmLink: getValueLink(key, osmValue),
            color
        }
    }).filter(row => row) as DiffRow[]
}

const getValueLink = (key: string, value: any): string | undefined => {
    if (key.endsWith('wikidata')) {
        return `https://www.wikidata.org/wiki/${value}`
    }
    if (key.endsWith('wikipedia')) {
        return `https://en.wikipedia.org/wiki/${value}`
    }
    if (['amenity'].includes(key)) {
        return `https://wiki.openstreetmap.org/wiki/Tag:${key}=${value}`
    }
    if (typeof value == "string" && value.match(/^https?:\/\//)) {
        return value
    }
    return undefined
}

export {
    getByKey,
    getDiff,
    getDiffTable,
    getMappedValues,
    getValueLink,
    matchOsm,
}
