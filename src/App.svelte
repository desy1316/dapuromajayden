<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "boxicons/css/boxicons.css";
  import Router, { location } from "svelte-spa-router";
  import { routes } from "./lib/routes";
  import Navigasi from "./lib/komponen/Navigasi.svelte";
  import Hero from "./lib/komponen/Hero.svelte";
  import Footer from "./lib/komponen/Footer.svelte";

  $: myroute = $location;
</script>

<Navigasi />
{#if myroute === "/"}
  <Hero />
{/if}
<Router {routes} />
<Footer />
