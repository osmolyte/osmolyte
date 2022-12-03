import {Position} from "geojson";

export interface City {
  name: string;
  coordinates: Position;
  zoom?: number;
  validators: {
    [ key: string ]: Validator;
  };
}

export interface Validator {
  name: string;
  source: string;
  root?: string;
  filter?: KeyValue;
  mapping: KeyValue;
  extra?: KeyValue;
  query: KeyValue;
  match_distance?: number;
}

export interface KeyValue {
  [ key: string ]: any;
}

export interface OsmObject {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  bounds?: {
    minlat: number;
    minlon: number;
    maxlon: number;
    maxlat: number;
  }
  timestamp: string;
  version: number;
  changeset: number;
  user: string;
  uid: number;
  tags: KeyValue
}

export interface DiffCounters {
  sameCount: number;
  diffCount: number;
  newCount: number;
}

export interface SourcePoint {
  coordinates: Position;
  ref: string;
  name?: string;
  diff?: DiffCounters;
  status?: string;
  osm?: OsmObject;
  mappedData?: KeyValue;
}

export interface DiffRow {
  key: string;
  sourceValue: any;
  sourceLink?: string;
  osmValue: any;
  osmLink?: string;
  color: string;
}
