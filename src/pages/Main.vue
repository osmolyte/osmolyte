<template>
  <Navbar/>
  <MDBContainer fluid>
    <MDBRow>
      <MDBCol col="3">
        <MDBListGroup class="list-group-light">
          <MDBListGroupItem class="d-flex justify-content-between align-items-center"
                            v-for="point in points">
            <router-link :to="`/${point.ref}`" class="button-primary">
              {{ point.name }}
            </router-link>
          </MDBListGroupItem>
        </MDBListGroup>
      </MDBCol>
      <MDBCol col="9">
        <Map :center="[35, 53]" :points="points" :onClick="onClick"/>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup lang="ts">
import {MDBCol, MDBListGroup, MDBListGroupItem, MDBRow, MDBContainer} from 'mdb-vue-ui-kit'
import Navbar from '../components/Navbar.vue'
import Map from "../components/Map.vue"
import cities from '../config/cities.json'
import {SourcePoint} from "../types"
import {bboxCenter} from "../utils/geo";
import {Router, useRouter} from "vue-router";

const points: SourcePoint[] = Object.keys(cities).map((cityId: string) => {
  const city = cities[cityId as keyof typeof cities]
  return {
    coordinates: bboxCenter(city.bbox),
    ref: cityId,
    name: city.name
  }
})

const router: Router = useRouter()
const onClick = function (point: SourcePoint) {
  router.replace(`/${point.ref}`)
}
</script>
