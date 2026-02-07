<script>
    import { onMount } from "svelte";
    import AOS from "aos";
    import "aos/dist/aos.css";
    const protagonis = "DokterListrik";
    const pagename = "Anti Jeglek";
    import alvin from "../../../public/kanglistrik.webp";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";
    let loading = true;

    const introdata = [
        {
            icon: "bx bxs-bolt bx-border-circle bx-flashing text-warning",
            text: "Butuh pasang listrik baru atau renovasi instalasi lama?",
        },
        {
            icon: "bx bxs-plug bx-border-circle bx-flashing text-warning",
            text: "Tenang, kami bekerja sesuai standar — bukan sekadar feeling.",
        },
        {
            icon: "bx bxs-bolt bx-border-circle bx-flashing text-warning",
            text: "Hasil rapi, aman, dan pastinya tidak bikin meteran panik sendiri ⚡",
        },
    ];

    const layanan = [
        {
            nama: "Maintenance Listrik",
            deskripsi:
                "Layanan perawatan dan perbaikan instalasi listrik rumah maupun ruko. Mulai dari penanganan konslet, listrik sering jeglek, lampu redup, hingga pengecekan jalur kabel agar tetap aman dan stabil digunakan.",
            nomor_wa: "6282237451542",
            icon: "bx bxs-bolt bx-border-circle text-info bx-burst",
        },
        {
            nama: "Instalasi Listrik",
            deskripsi:
                "Melayani pemasangan instalasi listrik baru dan renovasi instalasi lama untuk rumah serta bangunan usaha. Pengerjaan rapi, sesuai standar keselamatan, dan siap pakai tanpa bikin meteran panik.",
            nomor_wa: "6282237451542",
            icon: "bx bxs-plug bx-border-circle bx-burst text-warning",
        },
    ];

    // State Pengajuan
    let showModal = false;
    let selectedService = null;
    let namaUser = "";
    let alamatUser = "";
    let lat = -10.1708; // Kota Kupang
    let lng = 123.6069;
    let map;
    let marker;
    let isGeocoding = false;

    function buatPengajuan(service) {
        selectedService = service;
        showModal = true;

        // Initialize map after modal is rendered
        setTimeout(() => {
            initMap();
        }, 100);
    }

    async function getReverseGeocode(lat, lng) {
        isGeocoding = true;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                {
                    headers: {
                        "Accept-Language": "id",
                    },
                },
            );
            const data = await response.json();
            if (data && data.display_name) {
                alamatUser = data.display_name;
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        } finally {
            isGeocoding = false;
        }
    }

    function initMap() {
        if (map) {
            map.remove();
        }

        map = L.map("map").setView([lat, lng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Fix Icon Issue in Leaflet with Vite/Webpack
        const defaultIcon = L.icon({
            iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        marker = L.marker([lat, lng], {
            draggable: true,
            icon: defaultIcon,
        }).addTo(map);

        // Update address on init
        getReverseGeocode(lat, lng);

        marker.on("dragend", function (event) {
            const position = marker.getLatLng();
            lat = position.lat;
            lng = position.lng;
            getReverseGeocode(lat, lng);
        });

        // Trigger resize to fix tile issues in hidden containers
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }

    function kirimPengajuan() {
        if (!namaUser || !alamatUser) {
            alert("Harap isi nama dan alamat lengkap!");
            return;
        }

        const nomorWA = selectedService.nomor_wa;
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        let pesan = `*PENGAJUAN LAYANAN LISTRIK*\n`;
        pesan += `--------------------------------\n`;
        pesan += `Layanan: ${selectedService.nama}\n`;
        pesan += `Nama: ${namaUser}\n`;
        pesan += `Alamat: ${alamatUser}\n`;
        pesan += `--------------------------------\n`;
        pesan += `Lokasi (Maps): ${mapsLink}\n`;
        pesan += `--------------------------------\n`;
        pesan += `Mohon segera diproses ya Bang Listrik, Terima kasih!`;

        const waUrl = `https://wa.me/${nomorWA}?text=${encodeURIComponent(
            pesan,
        )}`;
        window.open(waUrl, "_blank");
        tutupModal();
    }

    function tutupModal() {
        showModal = false;
        selectedService = null;
        namaUser = "";
        alamatUser = "";
        if (map) {
            map.remove();
            map = null;
        }
    }

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 3500);
    });

    AOS.init({
        once: true,
    });
</script>

<section class="my-5 pb-5 antiJeglek">
    {#if loading}
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <p class="lead text-center">
                        <i class="bx bx-loader bx-spin"></i> Sedang Memuat Data...
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="container">
            <div class="row">
                <div
                    class="col-lg-12"
                    data-aos="fade-down"
                    data-aos-duration="3500"
                >
                    <div
                        class="alert alert-secondary"
                        role="alert"
                        style="border-radius: 20px;"
                    >
                        <h3
                            class="text-info font-weight-bolder text-capitalize"
                        >
                            <i class="text-warning bx bxs-bolt bx-border-circle"
                            ></i>
                            {pagename}
                        </h3>
                    </div>

                    <hr />
                    <div class="row">
                        <div class="col-lg-8 mb-2">
                            <div class="card banglistrik">
                                <div class="card-body">
                                    <h3 class="mt-5 text-capitalize">
                                        halo Kenalin kami dari <span
                                            class="text-uppercase text-info"
                                        >
                                            {protagonis}</span
                                        >
                                    </h3>
                                    <p>
                                        Yang Kami cek hanya tegangan, bukan
                                        hubungan
                                    </p>

                                    <img
                                        src={alvin}
                                        alt="..."
                                        class="img-fluid"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="card banglistrik">
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        {#each introdata as item}
                                            <li class="list-group-item">
                                                <i class={item.icon}></i>
                                                {item.text}
                                            </li>
                                        {/each}
                                    </ul>
                                    <h6
                                        class="my-2 text-dark ml-3 font-weight-bold"
                                    >
                                        #NyalaTanpaDrama
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- aboutus -->
        <div
            class="container my-3"
            data-aos="fade-down"
            data-aos-duration="2500"
        >
            <div class="row">
                <div class="col-lg-12">
                    <div class="card shadow shadow-sm">
                        <div class="card-body">
                            <h4>
                                <i
                                    class="bx bxs-bolt bx-border-circle text-warning"
                                ></i>
                                Tentang
                                {protagonis}
                            </h4>
                            <hr />
                            <p>
                                <i
                                    class="bx bxs-message-alt-check bx-border-circle text-info"
                                ></i>
                                DokterListrik adalah layanan jasa kelistrikan yang
                                fokus pada maintenance dan instalasi listrik untuk
                                rumah tinggal maupun ruko. Kami hadir untuk memastikan
                                instalasi listrik Anda aman, rapi, dan berfungsi
                                optimal — mulai dari perbaikan gangguan ringan, penanganan
                                konslet, hingga pemasangan instalasi baru.
                            </p>
                            <p>
                                <i
                                    class="bx bx-wrench bx-border-circle text-info"
                                ></i>
                                Didukung teknisi berpengalaman, kami bekerja sesuai
                                standar keselamatan, menggunakan material yang tepat,
                                dan mengutamakan kerapian hasil kerja. Setiap penanganan
                                dilakukan dengan pengecekan menyeluruh agar listrik
                                tetap stabil dan terhindar dari risiko jeglek maupun
                                kerusakan berulang.
                            </p>

                            <h5>
                                <i
                                    class="bx bx-question-mark bx-border-circle text-dark"
                                ></i>
                                Kenapa harus DokterListrik?
                            </h5>
                            <p class="m-0">
                                <i
                                    class="bx bx-check-shield bx-border-circle text-info"
                                ></i>
                                Karena kami bukan sekadar memperbaiki, tapi memastikan
                                listrik Anda kembali sehat, aman, dan nyaman digunakan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Services -->
        <div class="container" data-aos="fade-down" data-aos-duration="2000">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card shadow shadow-sm">
                        <div class="card-body">
                            <h3 class="my-3 text-left text-capitalize">
                                <i
                                    class="bx bx-cog bx-border-circle bx-spin text-dark"
                                ></i> Layanan Kami
                            </h3>
                            <hr />
                            <div class="myservice">
                                {#each layanan as datalayanan}
                                    <div class="card">
                                        <div class="card-body">
                                            <h5>
                                                <i class={datalayanan.icon}></i>
                                                {datalayanan.nama}
                                            </h5>
                                            <p>{datalayanan.deskripsi}</p>

                                            <button
                                                on:click={() =>
                                                    buatPengajuan(datalayanan)}
                                                title="Buat Pengajuan"
                                                type="button"
                                                class="btn btn-info shadow shadow-sm"
                                            >
                                                <i
                                                    class="bx bx-command bx-border-circle"
                                                ></i>
                                                Buat Pengajuan
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>

<!-- Modal Pengajuan -->
{#if showModal}
    <div
        class="modal fade show d-block"
        tabindex="-1"
        role="dialog"
        style="background-color: rgba(0,0,0,0.5); z-index: 1050; overflow-y: auto;"
    >
        <div
            class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            role="document"
        >
            <div class="modal-content" style="border-radius: 20px;">
                <div class="modal-header border-0">
                    <h5 class="modal-title font-weight-bold">Form Pengajuan</h5>
                    <button type="button" class="close" on:click={tutupModal}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body pt-0">
                    <p class="text-info small mb-3">
                        Layanan: <b>{selectedService.nama}</b>
                    </p>

                    <div class="form-group mb-2">
                        <label for="namaUser" class="text-muted small mb-1"
                            >Nama Lengkap</label
                        >
                        <input
                            id="namaUser"
                            type="text"
                            class="form-control"
                            bind:value={namaUser}
                            placeholder="Masukkan nama Anda..."
                        />
                    </div>

                    <div class="form-group mb-2">
                        <label for="alamatUser" class="text-muted small mb-1">
                            Alamat Lengkap
                            {#if isGeocoding}
                                <span class="text-info ml-2 small"
                                    ><i class="bx bx-loader bx-spin"></i> Menentukan
                                    di peta...</span
                                >
                            {/if}
                        </label>
                        <textarea
                            id="alamatUser"
                            class="form-control"
                            rows="2"
                            bind:value={alamatUser}
                            placeholder="Contoh: Jl. Diponegoro No. 10..."
                        ></textarea>
                    </div>

                    <div class="form-group mb-0">
                        <label for="map" class="text-muted small mb-1"
                            >Pointing Lokasi (Geser Pin)</label
                        >
                        <div
                            id="map"
                            style="height: 200px; width: 100%; border-radius: 15px;"
                        ></div>
                        <p
                            class="text-muted mb-0 mt-1"
                            style="font-size: 0.7rem;"
                        >
                            Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                        </p>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        on:click={tutupModal}>Batal</button
                    >
                    <button
                        type="button"
                        class="btn btn-info btn-sm"
                        on:click={kirimPengajuan}
                    >
                        <i class="bx bxl-whatsapp"></i> Kirim Pengajuan
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .myservice {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    .antiJeglek {
        min-height: 100vh;
    }
    .intro {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .card {
        border-radius: 10px;
    }
    .banglistrik {
        min-height: 310px;
        position: relative;
        overflow: hidden;
    }

    .banglistrik img {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 220px;
    }

    @media (max-width: 576px) {
        .banglistrik img {
            height: 160px;
        }

        .myservice {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
