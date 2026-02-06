<script>
    const navname = "dapuromajayden";
    import { daftaritem } from "../store/store";
    let count = 0;
    $: count = $daftaritem.length;
</script>

<nav class="navbar navbar-expand-lg navbar-light sticky-top navbar-glass">
    <div class="container">
        <a class="navbar-brand text-capitalize" href="#/">
            <i class="bx bx-store-alt oyen bx-border-circle"></i>
            {navname}
        </a>
        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-link" href="#/">
                    <i class="bx bx-home-heart bx-border-circle"></i>
                    Home
                </a>
                <a class="nav-link" href="#/service">
                    <i class="bx bxs-package bx-border-circle"></i>
                    Layanan
                </a>
                <a class="nav-link" href="#/keranjang">
                    <i class="bx bxs-cart bx-border-circle"></i>
                    Keranjang
                    <sup>
                        <span class="badge badge-danger">{count}</span>
                    </sup>
                </a>
            </div>
        </div>
    </div>
</nav>

<style>
    .navbar-glass {
        /* Warna putih transparan banget */
        background: var(--glass-bg) !important;

        /* EFEK UTAMA: Blur di belakang navbar */
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px); /* Support Safari iPhone */

        /* Border tipis biar kelihatan ada dimensi kaca */
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.3s ease;
    }

    .navbar-brand,
    .nav-link {
        color: var(--text-color) !important;
    }

    .navbar-brand {
        font-size: 1rem;
    }

    .nav-link {
        font-size: 0.8rem !important;
    }
</style>
