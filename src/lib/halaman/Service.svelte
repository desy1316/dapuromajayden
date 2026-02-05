<script>
    const pagename = "Tomorow Laundry";
    import { push } from "svelte-spa-router";
    import Banner from "../komponen/Banner.svelte";
    let loading = true;
    setTimeout(() => {
        loading = false;
    }, 2500);
</script>

<section class="service mb-5 pb-5">
    {#if loading}
        <p class="lead text-center">Sedang Memuat Data ....</p>
    {:else}
        <div class="container">
            <div class="row">
                <div class="col-lg-11 mx-auto">
                    <div
                        class="d-flex justify-content-between align-items-center"
                    >
                        <h3 class="oyen">{pagename}</h3>
                        <button
                            class="btn btn-white"
                            on:click={() => push("/")}
                        >
                            <i class="bx bx-undo"></i>
                            Kembali
                        </button>
                    </div>
                    <hr />
                    <Banner />
                </div>
            </div>
        </div>
    {/if}
</section>
