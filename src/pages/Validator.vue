<template>
  <Navbar/>
  <MDBContainer fluid>
    <MDBRow>
      <MDBCol col="3" class="vh-100" style="overflow-y: scroll">
        <MDBListGroup class="list-group-light">
          <template v-for="point in points">
            <MDBListGroupItem v-if="point.mappedData && point.diff" action
                              :class="`px-2 py-1 border-0 rounded-6 ripple mb-1 list-group-item-${point.status}`">
              <router-link :to="`/${cityId}/${validatorId}/${point.mappedData.ref}`">
                <div class="d-flex justify-content-between">
                  <div>
                    <MDBBadge color="light" class="text-dark">{{ point.mappedData.ref }}</MDBBadge>
                    {{ point.name }}
                  </div>
                  <div style="white-space: nowrap">
                    <MDBBadge pill color="light">{{ point.diff.sameCount }}</MDBBadge>
                    <MDBBadge pill v-if="point.diff.diffCount" badge="warning">{{ point.diff.diffCount }}</MDBBadge>
                    <MDBBadge pill v-if="!point.diff.diffCount" color="warning">0</MDBBadge>
                    <MDBBadge pill v-if="point.diff.newCount" badge="info">{{ point.diff.newCount }}</MDBBadge>
                    <MDBBadge pill v-if="!point.diff.newCount" color="info">0</MDBBadge>
                  </div>
                </div>
              </router-link>
            </MDBListGroupItem>
          </template>
        </MDBListGroup>
      </MDBCol>
      <MDBCol col="9">
        <MDBRow>
          <Map :zoom="getChosenPoint() ? 14 : 12" :center="getChosenPoint().coordinates" :points="points" :onClick="onClick"/>
        </MDBRow>
        <MDBRow v-if="getChosenPoint().ref" col="3">
          <Comparison :point="getChosenPoint()"/>
        </MDBRow>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup lang="ts">
import {MDBBadge, MDBCol, MDBContainer, MDBListGroup, MDBListGroupItem, MDBRow} from 'mdb-vue-ui-kit'
import Map from "../components/Map.vue";
import Navbar from '../components/Navbar.vue'
import cities from '../config/cities.json'
import {getByKey, getDiff, getMappedValues, matchOsm} from '../utils/match'
import {RouteLocationNormalizedLoaded, Router, useRoute, useRouter} from "vue-router"
import {City, Validator, KeyValue, SourcePoint, OsmObject} from "../types";
import {loadOverpass, loadSource} from "../utils/load";
import {ref, Ref, watch} from "vue";
import Comparison from "../components/Comparison.vue";

const router: Router = useRouter()
const route: RouteLocationNormalizedLoaded = useRoute()

const cityId: string = route.params.cityId as string
const validatorId: string = route.params.validatorId as string

const city: City = (cities as KeyValue)[cityId] || {}
const config: Validator = city.validators[validatorId]

const overpassData: OsmObject[] = await loadOverpass(config.query, city)
const sourceItems: any[] = await loadSource(config)

const points: SourcePoint[] = sourceItems.map((item: any) => {
  const osm: OsmObject | undefined = matchOsm(item, overpassData, config)
  const mappedData: KeyValue = getMappedValues(item, config)
  const diff = getDiff(mappedData, osm?.tags || {})

  let status: string = 'secondary'
  if (!osm) {
    status = 'danger'
  } else if (diff.diffCount) {
    status = 'warning'
  } else if (diff.newCount) {
    status = 'info'
  }

  return {
    coordinates: [
      getByKey(item, config.mapping._lon),
      getByKey(item, config.mapping._lat),
    ],
    ref: getByKey(item, config.mapping.ref),
    name: getByKey(item, config.mapping._name),
    status,
    osm,
    mappedData,
    diff,
  }
})

const sourceObject: Ref = ref({})
if (route.params.ref) {
  sourceObject.value = points.find((point: SourcePoint) => point.ref == route.params.ref)
}

watch(route, (toRoute: RouteLocationNormalizedLoaded) => {
  if (toRoute.params.ref) {
    sourceObject.value = points.find((point: SourcePoint) => point.ref == toRoute.params.ref)
  } else {
    sourceObject.value = {}
  }
})

const onClick = function (point: SourcePoint) {
  router.replace(`/${cityId}/${validatorId}/${point.ref}`)
}

const getChosenPoint = () => sourceObject.value ?? {}
</script>
