<template>
  <MDBNavbar expand="lg" light bg="light" container>
    <MDBNavbarBrand href="/" router to="/">OSMolyte</MDBNavbarBrand>
    <MDBNavbarNav>
      <div class="navbar-text">
        <Breadcrumbs/>
      </div>
    </MDBNavbarNav>
  </MDBNavbar>
</template>

<script setup lang="ts">
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
} from 'mdb-vue-ui-kit';
import Breadcrumbs from "./Breadcrumbs.vue";
</script>
