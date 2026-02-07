<script>
    import { daftaritem } from "../store/store";
    let count = 0;
    $: count = $daftaritem.length;
</script>

<footer class="footer-glass d-block d-lg-none">
    <div class="footer-link p-2">
        <a href="#/" class="text-decoration-none" title="Homepage">
            <i class="bx bx-home bx-border-circle"></i>
        </a>

        <a
            href="#/jeglek-rescue"
            class="text-decoration-none"
            title="Dokter Listrik"
        >
            <i class="bx bxs-plug bx-border-circle"></i>
        </a>

        <a href="#/service" class="text-decoration-none" title="Service">
            <i class="bx bxs-washer bx-border-circle"></i>
        </a>

        <a href="#/keranjang" class="text-decoration-none" title="Homepage">
            <i class="bx bx-cart bx-border-circle"></i>
            <sup>
                <span class="badge badge-danger">
                    {count}
                </span>
            </sup>
        </a>
    </div>
</footer>

<style>
    footer {
        position: fixed;
        width: 100%;
        z-index: 999999;
        bottom: 0;
        left: 0;
        right: 0;
        height: 55px;
    }
    .footer-link {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .footer-glass {
        background: var(--glass-bg) !important;

        /* EFEK UTAMA: Blur di belakang navbar */
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px); /* Support Safari iPhone */

        /* Border tipis biar kelihatan ada dimensi kaca */
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.3s ease;
    }

    i {
        color: var(--text-color);
    }
    .bx-border-circle {
        border-color: var(--text-color) !important;
        opacity: 0.5;
    }
    a {
        font-size: 1.2rem;
    }
</style>
