<script>
    import { onMount } from "svelte";
    import { supabase } from "../supabase";

    // swiper
    import Swiper from "swiper";
    import "swiper/css";
    import "swiper/css/pagination";
    import { Pagination, Autoplay } from "swiper/modules";

    let sliders = [];
    let is_loading = true;
    let swiperEl;

    async function getimageslider() {
        try {
            const { data, error } = await supabase.from("sliders").select("*");

            if (error) {
                console.error(error);
            } else {
                sliders = data;
            }
        } finally {
            is_loading = false;
            setTimeout(initSwiper, 100);
        }
    }

    function showimage(filename) {
        const { data } = supabase.storage
            .from("slider_image")
            .getPublicUrl(filename);

        return data.publicUrl;
    }

    function initSwiper() {
        new Swiper(swiperEl, {
            modules: [Pagination, Autoplay],

            loop: true,
            spaceBetween: 5,

            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },

            autoplay: {
                delay: 2000,
            },

            // default mobile
            slidesPerView: 1.2,

            breakpoints: {
                // ≥ 640px (HP landscape / tablet kecil)
                640: {
                    slidesPerView: 1.5,
                },

                // ≥ 768px (tablet)
                768: {
                    slidesPerView: 2,
                },

                // ≥ 1024px (laptop)
                1024: {
                    slidesPerView: 2.1,
                },

                // ≥ 1280px (desktop gede)
                1280: {
                    slidesPerView: 2.5,
                },
            },
        });
    }

    onMount(() => {
        getimageslider();
    });
</script>

<div bind:this={swiperEl} class="swiper">
    <div class="swiper-wrapper">
        {#each sliders as slider}
            <div class="swiper-slide">
                <img src={showimage(slider.slider)} class="img-fluid" />
            </div>
        {/each}
    </div>

    <div class="swiper-pagination"></div>
</div>

<style>
    img {
        border-radius: 11px;
    }
</style>
