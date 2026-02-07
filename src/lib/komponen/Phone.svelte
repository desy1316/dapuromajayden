<script>
    import { onMount } from "svelte";
    import "aos/dist/aos.css";
    let loading = true;

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 3500);
    });
</script>

{#if loading}
    <div class="text-center">Loading....</div>
{:else}
    <section class="my-4 py-4" data-aos="fade-down" data-aos-duration="2000">
        <div class="container-fluid">
            <div class="icon-grid">
                <div class="card">
                    <div class="card-body">
                        <h1 class="text-center">
                            <i class="bx bx-store-alt bx-border-circle oyen"
                            ></i>
                            <p class="lead">Pesan</p>
                        </h1>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <h1 class="text-center font-weight-bold">
                            <i class="bx bx-bowl-hot bx-border-circle oyen"></i>
                            <p class="lead">Makan</p>
                        </h1>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <h1 class="text-center">
                            <i class="bx bx-wink-smile bx-border-circle oyen"
                            ></i>
                            <p class="lead">Happy</p>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </section>
{/if}

<style>
    .icon-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
</style>
