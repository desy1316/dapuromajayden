<script>
    import { onMount } from "svelte";
    import src from "../../../public/Frame.png";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";

    const narasiLaundry = [
        "Kami tidak menjual janji, kami memberikan hasil.",
        "Karena layanan laundry seharusnya menghasilkan pakaian yang bersih dan wangi,",
        "bukan menimbulkan pertanyaan: “Apakah ini sudah dicuci dengan benar?”",
    ];

    const serviceName = "kenapa harus Kami";
    const whyus = [
        {
            title: "Cuci Bersih & Wangi Tahan Lama",
            narasi: "Menggunakan deterjen berkualitas dan pewangi premium, membuat pakaian bersih maksimal dan harum lebih lama.",
        },
        {
            title: "Pengerjaan Cepat",
            narasi: "Tersedia layanan reguler dan express, cocok buat kamu yang butuh laundry selesai lebih cepat.",
        },
        {
            title: "Setrika Rapi & Halus",
            narasi: "Pakaian disetrika dengan standar profesional, rapi dilipat atau digantung siap pakai.",
        },
        {
            title: "Harga Terjangkau",
            narasi: "Memberikan layanan terbaik dengan harga yang tetap ramah di kantong.",
        },
    ];

    onMount(() => {
        const map = L.map("map").setView(
            [-10.196283596158715, 123.58164825483455],
            13,
        );

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        L.marker([-10.196283596158715, 123.58164825483455])
            .addTo(map)
            .bindPopup("Tomorow laundry 🚀")
            .openPopup();
    });
    const phoneNumber = "";
</script>

<section class="mt-4 pb-5 banner">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-4">
                        {#each narasiLaundry as item}
                            <p class="lead">
                                <i class="bx bx-check-circle oyen"></i>
                                {item}
                            </p>
                        {/each}
                    </div>
                    <div class="col-lg-8">
                        <img {src} class="img-fluid w-100" alt="..." />
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <h5 class="my-3">
                    {serviceName}
                </h5>

                <div class="service-grid">
                    {#each whyus as must}
                        <div class="card my-2">
                            <div class="card-body">
                                <h6>{must.title}</h6>
                                <p>{must.narasi}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <h5 class="my-2">Kunjungi Outlet Kami</h5>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div id="map"></div>
            </div>
            <div class="col-lg-4">
                <p class="mt-4">
                    <i class="bx bx-home"></i>
                    Jl. Jambu No.55, RT./RW/RW.005, 002, Batuplat, Kec. Alak, Kota
                    Kupang, Nusa Tenggara Tim. 85228
                </p>
            </div>
        </div>
    </div>
</section>

<style>
    #map {
        width: 100%;
        height: 350px;
        border-radius: 15px;
    }
    .service-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    .lead {
        font-size: 0.9rem;
    }
    .banner {
        min-height: 30vh;
    }

    .card {
        border-radius: 15px;
    }

    @media (max-width: 576px) {
        .service-grid {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
