<script>
    const herotitle = "dapuromajayden";
    const herotagline = "Sarapan Pagi Biar Tidak Dimarahin Lambung";
    import { theme } from "../store/store";

    function toggleTheme() {
        theme.update((t) => (t === "light" ? "dark" : "light"));
    }
</script>

<div class="container">
    <div class="jumbotron bg-light">
        <div class="container">
            <h1 class="font-weight-bolder oyen text-capitalize">{herotitle}</h1>
            <p class="lead text-capitalize">
                {herotagline}
            </p>

            <!-- darkmode  -->
            <button
                class="btn btn-white border shadow-sm"
                on:click={toggleTheme}
            >
                {#if $theme === "light"}
                    <i class="bx bx-moon text-warning"></i>
                    Dark Mode
                {:else}
                    <i class="bx bx-sun text-warning"></i>
                    Light Mode
                {/if}
            </button>
        </div>
    </div>
</div>

<style>
    .jumbotron {
        margin-top: 20px;
        border-radius: 10px;
    }
    @media (max-width: 576px) {
        .jumbotron {
            text-align: center;
        }
        p {
            font-size: 1rem;
        }
    }
</style>
