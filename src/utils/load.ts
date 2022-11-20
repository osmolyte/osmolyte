import {KeyValue, OsmObject, SourcePoint} from "../types"

async function loadJson(url: string): Promise<any> {
    const cache: any[] = JSON.parse(localStorage.getItem('v1000') || '[]')
        .filter((cacheItem: any) => cacheItem.time > Date.now() - 1500)
    localStorage.setItem('v1000', JSON.stringify(cache))

    for (const i in cache) {
        if (cache[i].url === url) {
            return cache[i].response
        }
    }

    const response = await fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Something went wrong!")
        })
        .catch((error) => {
            console.error(error)
        });

    cache.push({
        url,
        response,
        time: Date.now()
    })
    localStorage.setItem('v1000', JSON.stringify(cache))

    return response
}

async function loadOverpass(query: KeyValue): Promise<OsmObject[]> {
    const queryString: string = Object.keys(query).map(key => {
        if (key === '_bbox') {
            return `(${query[key].join(',')})`
        }
        return `[${key}=${query[key]}]`
    }).join('')
    const request: string = `[out:json]; node${queryString}; out meta;`
    return (await loadJson(`https://overpass-api.de/api/interpreter?data=${request}`)).elements
}

const openJosm = async (point: SourcePoint) => {
    const newTags: string[] = Object.keys(point.mappedData || {}).map(key => {
        if (key.startsWith('_')) {
            return ''
        }

        const sourceValue = point.mappedData?.[key]
        const osmValue = point.osm?.tags?.[key]

        if (sourceValue == osmValue) {
            return ''
        }

        return `${key}=${sourceValue}`
    }).filter(tagPair => tagPair)

    let command: string;
    if (point.osm !== undefined) {
        const ref: string = point.osm.type[0] + point.osm.id.toString()
        command = `http://127.0.0.1:8111/load_object?objects=${ref}`
    } else {
        command = `http://127.0.0.1:8111/add_node?lon=${point.coordinates[0]}&lat=${point.coordinates[1]}`
    }

    await fetch(`${command}&addtags=${newTags.join('%7C')}`)
}

export {
    loadJson,
    loadOverpass,
    openJosm,
}
