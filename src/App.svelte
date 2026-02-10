<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "boxicons/css/boxicons.css";
  import Router, { location } from "svelte-spa-router";
  import { routes } from "./lib/routes";
  import Navigasi from "./lib/komponen/Navigasi.svelte";
  import Footer from "./lib/komponen/Footer.svelte";
</script>

<Navigasi />

<Router {routes} />
<Footer />
