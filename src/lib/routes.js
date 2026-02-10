import Home from "./halaman/Home.svelte";
import Keranjang from "./halaman/Keranjang.svelte"
import DokterListrik from "./halaman/DokterListrik.svelte";
export const routes = {
    '/': Home,
    '/keranjang': Keranjang,
    '/jeglek-rescue': DokterListrik
}