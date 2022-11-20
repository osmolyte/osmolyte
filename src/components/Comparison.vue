<template>
  <MDBTable class="table-sm">
    <thead>
    <tr>
      <th scope="col" style="width:20%">Key</th>
      <th scope="col" style="width:32%">Source</th>
      <th scope="col" style="width:32%">
        <a v-if="point.osm" :href="`https://www.openstreetmap.org/${point.osm.type}/${point.osm.id}`"
           target="_blank">OSM</a>
        <template v-else>OSM</template>
      </th>
      <th scope="col" style="width:6%">
        <MDBBtn outline="success" size="sm" @click="openJosm(point)">JOSM</MDBBtn>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in getDiffTable(point)"
        :class="`table-${row.color}`">
      <th scope="row">
        <a target="_blank" :href="`https://wiki.openstreetmap.org/wiki/Key:${row.key}`">
          {{ row.key }}
        </a>
      </th>
      <td>
        <a v-if="row.sourceLink" :href="row.sourceLink" target="_blank">{{ row.sourceValue }}</a>
        <template v-else>{{ row.sourceValue }}</template>
      </td>
      <td>
        <a v-if="row.osmLink" :href="row.osmLink" target="_blank">{{ row.osmValue }}</a>
        <template v-else>{{ row.osmValue }}</template>
      </td>
      <td/>
    </tr>
    </tbody>
  </MDBTable>
</template>

<script setup lang="ts">
import {MDBBtn, MDBTable} from 'mdb-vue-ui-kit'
import {SourcePoint} from "../types";
import {openJosm} from "../utils/load";
import {getDiffTable} from "../utils/match";

const props = defineProps<{
  point: SourcePoint
}>()

</script>
