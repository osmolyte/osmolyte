<template>
  <nav aria-label="breadcrumb">
    <MDBBreadcrumb>
      <MDBBreadcrumbItem v-if="cityId">
        <router-link :to="`/${cityId}`">{{ city.name }}</router-link>
      </MDBBreadcrumbItem>
      <MDBBreadcrumbItem v-if="validatorId">
        <router-link :to="`/${cityId}/${validatorId}`">{{ validator.name }}</router-link>
      </MDBBreadcrumbItem>
    </MDBBreadcrumb>
  </nav>
</template>

<script setup lang="ts">
  import {MDBBreadcrumb, MDBBreadcrumbItem} from 'mdb-vue-ui-kit';
  import {RouteParams, useRoute} from "vue-router";
  import cities from '../config/cities.json'
  import {City, Validator} from "../types";

  const params: RouteParams = useRoute().params
  const cityId: string = params.cityId as string
  const validatorId: string = params.validatorId as string

  const city: City = (cities as any)[cityId] || {}
  const validator: Validator = (cities as any)[cityId]?.validators?.[validatorId] || {}
</script>
