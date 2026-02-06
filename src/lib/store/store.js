import { writable } from "svelte/store";
const MyLocalStorage = JSON.parse(localStorage.getItem('cart')) || []
export const daftaritem = writable(MyLocalStorage)
daftaritem.subscribe(value => {
    localStorage.setItem('cart', JSON.stringify(value))
})

// Theme Store
const initialTheme = localStorage.getItem('theme') || 'light';
export const theme = writable(initialTheme);
theme.subscribe(value => {
    localStorage.setItem('theme', value);
    if (value === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});
