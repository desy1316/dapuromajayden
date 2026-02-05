import { writable } from "svelte/store";
const MyLocalStorage = JSON.parse(localStorage.getItem('cart')) || []
export const daftaritem = writable(MyLocalStorage)
daftaritem.subscribe(value => {
    localStorage.setItem('cart', JSON.stringify(value))
})