<template>
  <Navbar/>
  <MDBContainer fluid>
    <MDBRow>
      <MDBCol col="3">
        <MDBListGroup class="list-group-light">
          <MDBListGroupItem class="d-flex justify-content-between align-items-center"
                            v-for="validatorId in Object.keys(validators)">
            <router-link :to="`/${cityId}/${validatorId}`" class="button-primary">
              {{ validators[validatorId].name }}
            </router-link>
            <MDBBadge class="badge-secondary" pill>0</MDBBadge>
          </MDBListGroupItem>
        </MDBListGroup>
      </MDBCol>
      <MDBCol col="9">
        <Map :zoom="11" :center="city.coordinates"/>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup lang="ts">
import {MDBBadge, MDBCol, MDBListGroup, MDBListGroupItem, MDBRow, MDBContainer} from 'mdb-vue-ui-kit'
import Navbar from '../components/Navbar.vue'

import {RouteParams, useRoute} from "vue-router";
import cities from '../config/cities.json'
import Map from "../components/Map.vue";
import {City, Validator} from "../types";

const params: RouteParams = useRoute().params
const cityId: string = params.cityId as string
const city: City = (cities as any)[cityId] || {}
const validators: {[key: string]: Validator} = (cities as any)[cityId]?.validators || {}
</script>
