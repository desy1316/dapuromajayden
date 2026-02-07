import Home from "./halaman/Home.svelte";
import Service from "./halaman/Service.svelte";
import Keranjang from "./halaman/Keranjang.svelte"
import DokterListrik from "./halaman/DokterListrik.svelte";
export const routes = {
    '/': Home,
    '/service': Service,
    '/keranjang': Keranjang,
    '/jeglek-rescue': DokterListrik
}