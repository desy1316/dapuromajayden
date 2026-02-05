<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "boxicons/css/boxicons.css";
  import Router from "svelte-spa-router";
  import { routes } from "./lib/routes";
  import Navigasi from "./lib/komponen/Navigasi.svelte";
  import Hero from "./lib/komponen/Hero.svelte";
  import Footer from "./lib/komponen/Footer.svelte";
</script>

<Navigasi />
<Hero />
<Router {routes} />
<Footer />
