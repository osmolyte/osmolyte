<template>
  <MapboxMap
      style="height:50vh"
      :accessToken="myAccessToken"
      :zoom="zoom || 3"
      :center="realCenter"
      mapStyle="light-v10"
  >
    <MapboxMarker v-for="point in points"
                  :lngLat="point.coordinates"
                  :color="point.status && markerColors[point.status]"
                  @click="onClick && onClick(point)"/>
  </MapboxMap>
</template>

<script setup lang="ts">
import { MapboxMap, MapboxMarker } from "vue-mapbox-ts";
import {KeyValue, SourcePoint} from "../types";
import {Position} from "geojson";

const props = defineProps<{
  zoom?: number
  center?: Position
  points?: SourcePoint[]
  onClick?: Function
}>()

const myAccessToken: String = 'pk.eyJ1IjoicHV0bmlrIiwiYSI6InZ0Um1wWEUifQ.KxIgCLHXAukq0_ugVyxSqA';

const markerColors: KeyValue = {
  'success': '#31C571',
  'info': '#6DB2E3',
  'secondary': '#BBBBBB',
  'warning': '#FFCC38',
  'danger': '#FE5D4D',
}

const realCenter = ((center?: number[], points?: any[]): number[] => {
  if (center) {
    return center
  }

  if (!points) {
    return [0, 0]
  }

  const minLon: number = points.map(point => point.coordinates[0]).reduce((a, b) => a < b ? a : b)
  const maxLon: number = points.map(point => point.coordinates[0]).reduce((a, b) => a > b ? a : b)
  const minLat: number = points.map(point => point.coordinates[1]).reduce((a, b) => a < b ? a : b)
  const maxLat: number = points.map(point => point.coordinates[1]).reduce((a, b) => a > b ? a : b)
  return [
    (minLon + maxLon) / 2,
    (minLat + maxLat) / 2,
  ]
})(props.center, props.points)
</script>
