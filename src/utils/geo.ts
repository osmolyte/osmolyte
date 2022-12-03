import {Position} from "geojson";

const bboxCenter = (bbox: number[]): Position => ([(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2])

export {
    bboxCenter,
}
