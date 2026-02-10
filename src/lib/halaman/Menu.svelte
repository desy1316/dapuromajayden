<script>
    import Phone from "../komponen/Phone.svelte";
    import { formatharga } from "../helper";
    import { supabase } from "../supabase";
    import { onMount } from "svelte";
    import { daftaritem } from "../store/store";
    import Slider from "../komponen/Slider.svelte";
    import AOS from "aos";
    import "aos/dist/aos.css";
    let allMenus = []; // 🔹 DATA ASLI
    let menus = []; // 🔹 DATA TAMPIL
    let kategoris = [];

    let loading = true;
    let detail = false;
    let detaildatamenu;

    let pencarianmenu = "";
    let selectedKategori = null;

    async function FetchMenus() {
        const { data, error } = await supabase
            .from("produk")
            .select("*")
            .order("harga", { ascending: false });

        const mapped = data.map((menu) => {
            const { data: img } = supabase.storage
                .from("foto_produk")
                .getPublicUrl(menu.gambar);

            return {
                ...menu,
                imageUrl: img.publicUrl,
            };
        });

        allMenus = mapped;
        menus = mapped;
    }

    async function getkategori() {
        const { data } = await supabase
            .from("kategori")
            .select("*")
            .order("id", { ascending: true });

        kategoris = data;
    }

    async function menuDetail(id) {
        const { data } = await supabase
            .from("produk")
            .select("*")
            .eq("id", id)
            .single();

        if (data) {
            const { data: poster } = supabase.storage
                .from("foto_produk")
                .getPublicUrl(data.gambar);

            detaildatamenu = {
                ...data,
                posterdata: poster.publicUrl,
            };
            detail = true;
        }
    }

    function filterKategori(id) {
        selectedKategori = id;
    }

    function resetKategori() {
        selectedKategori = null;
    }

    function addtoCart(menu) {
        daftaritem.update((items) => {
            let myindex = items.findIndex((item) => item.id === menu.id);
            if (myindex !== -1) {
                items[myindex].qty += 1;
                items[myindex].subtotal = menu.harga * items[myindex].qty;
            } else {
                items.push({
                    id: menu.id,
                    nama_produk: menu.nama_produk,
                    harga: menu.harga,
                    qty: 1,
                    subtotal: menu.harga,
                });
            }
            return items;
        });

        alert("berhasil menambahkan item ke dalam keranjang");
    }

    $: mymenu = allMenus.filter((data) => {
        const cocokKategori =
            selectedKategori === null || data.kategori_id === selectedKategori;

        const cocokSearch = data.nama_produk
            .toLowerCase()
            .includes(pencarianmenu.toLowerCase());

        return cocokKategori && cocokSearch;
    });

    // Preorder Logic
    let showModalPreorder = false;
    let preorderItem = null;
    let preorderTanggal = "";
    let preorderQty = 1;

    // Set minimal tanggal = Besok (H+1)
    let minDate = "";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    minDate = tomorrow.toISOString().split("T")[0];

    function openPreorder(menu) {
        preorderItem = menu;
        preorderQty = 1;
        preorderTanggal = "";
        showModalPreorder = true;
    }

    function closePreorder() {
        showModalPreorder = false;
        preorderItem = null;
    }

    function kirimPreorder() {
        if (!preorderTanggal) {
            alert("Harap isi tanggal pengambilan!");
            return;
        }

        const nomorAdmin = "6282144559047";
        let message = `*HALO OMA MAU PREORDER*\n`;
        message += `--------------------------------\n`;
        message += `Nama Item: ${preorderItem.nama_produk}\n`;
        message += `Harga: ${formatharga(preorderItem.harga)} / ${preorderItem.satuan}\n`;
        message += `Qty: ${preorderQty} ${preorderItem.satuan}\n`;
        message += `Estimasi Total: ${formatharga(preorderItem.harga * preorderQty)}\n`;
        message += `--------------------------------\n`;
        message += `Tanggal Pengambilan: ${preorderTanggal}\n`;
        message += `--------------------------------\n`;
        message += `Mohon info ketersediaan ya OmaJayden, Terima kasih!`;

        const waLink = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`;
        window.open(waLink, "_blank");
        closePreorder();
    }

    let orderCheck;
    function bolehOrder() {
        const waktu = new Date();
        const hari = waktu.getDay();
        const jam = waktu.getHours();

        orderCheck = jam >= 6 && jam <= 10 && hari >= 1 && hari <= 5;
    }

    onMount(async () => {
        bolehOrder();
        await getkategori();
        await FetchMenus();
        loading = false;
    });

    AOS.init({
        once: true,
    });
</script>

<!-- Modal Preorder (Svelte Controlled Bootstrap Style) -->
{#if showModalPreorder}
    <div
        class="modal fade show d-block"
        tabindex="-1"
        role="dialog"
        style="background-color: rgba(0,0,0,0.5);"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" style="border-radius: 20px;">
                <div class="modal-header border-0">
                    <h5 class="modal-title font-weight-bold">Form Preorder</h5>
                    <button
                        type="button"
                        class="close"
                        on:click={closePreorder}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="text-muted small">Menu yang dipesan</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            value={preorderItem.nama_produk}
                            readonly
                        />
                    </div>
                    <div class="form-group">
                        <label class="text-muted small">Harga Satuan</label>
                        <input
                            type="text"
                            class="form-control"
                            value="{formatharga(
                                preorderItem.harga,
                            )} / {preorderItem.satuan}"
                            readonly
                        />
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="text-muted small"
                                    >Jumlah ({preorderItem.satuan})</label
                                >
                                <input
                                    type="number"
                                    class="form-control"
                                    bind:value={preorderQty}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label class="text-muted small"
                                    >Tanggal Pengambilan</label
                                >
                                <input
                                    type="date"
                                    class="form-control"
                                    bind:value={preorderTanggal}
                                    min={minDate}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="alert alert-warning small p-2">
                        <i class="bx bx-info-circle"></i> Item ini adalah Preorder.
                        Tidak tersedia langsung.
                    </div>

                    <div class="form-group mb-0">
                        <label class="text-muted small">Deskripsi Produk</label>
                        <textarea class="form-control small" rows="3" readonly
                            >{preorderItem.deskripsi}</textarea
                        >
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        on:click={closePreorder}>Batal</button
                    >
                    <button
                        type="button"
                        class="btn btn-oyen btn-sm"
                        on:click={kirimPreorder}
                    >
                        <i class="bx bxl-whatsapp"></i> Kirim Pesan
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<section class="mt-5 p-2">
    <div class="container">
        <Slider />
    </div>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                {#if loading}
                    <div
                        class="d-flex justify-content-center align-items-center"
                    >
                        <h3 class="my-4 text-center">
                            <i class="bx bx-loader bx-spin"></i>
                            Memuat Data...
                        </h3>
                    </div>
                {:else if detail}
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-3 text-center my-3">
                                    <img
                                        src={detaildatamenu.posterdata}
                                        alt="..."
                                        class="img-fluid image-detail detail_image"
                                    />
                                </div>
                                <div class="col-lg-9">
                                    <h1>{detaildatamenu.nama_produk}</h1>
                                    <hr />

                                    <h6 class="text-muted">
                                        <i
                                            class="bx bx-wallet-alt bx-border-circle"
                                        ></i>
                                        {formatharga(detaildatamenu.harga)} / {detaildatamenu.satuan}
                                    </h6>

                                    <p class="text-muted">
                                        {#if detaildatamenu.preorder}
                                            Menu ini harus dipesan terlebih
                                            dahulu
                                        {:else}
                                            Ready
                                        {/if}
                                    </p>

                                    <p>
                                        <span
                                            role="button"
                                            data-toggle="collapse"
                                            data-target="#collapseExample"
                                            class="oyen font-weight-bolder"
                                        >
                                            Baca Deskripsi Produk
                                        </span>
                                    </p>
                                    <div class="collapse" id="collapseExample">
                                        <div class="card card-body">
                                            {detaildatamenu.deskripsi}
                                        </div>
                                    </div>

                                    <button
                                        class="btn btn-oyen mt-2 btn-sm"
                                        on:click={() => (
                                            (detail = false),
                                            (pencarianmenu = "")
                                        )}
                                    >
                                        <i class="bx bx-undo oyen"></i>
                                        Kembali
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    <div class="my-2">
                        <div class="row">
                            <div class="col-lg-12">
                                <input
                                    type="text"
                                    placeholder="Cari Menu..."
                                    class="form-control form-control-lg"
                                    bind:value={pencarianmenu}
                                />

                                <div class="my-2">
                                    <div
                                        class="d-flex justify-content-between align-items-center mt-4 mb-0 flex-wrap"
                                    >
                                        <button
                                            class="btn btn-white"
                                            title="semua kategori"
                                            on:click={() =>
                                                filterKategori(null)}
                                        >
                                            <i
                                                class="bx bx-category bx-border-circle oyen"
                                            ></i>
                                            Semua
                                        </button>
                                        {#each kategoris as kategori}
                                            <p
                                                role="button"
                                                title="filter kategori"
                                                on:click={() =>
                                                    filterKategori(kategori.id)}
                                            >
                                                <i
                                                    class="bx bxs-bowl-hot bx-border-circle oyen"
                                                ></i>
                                                {kategori.kategori}
                                            </p>
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid-menu">
                        {#each mymenu as menu}
                            <div
                                class="my-1"
                                data-aos="fade-zoom-in"
                                data-aos-offset="200"
                                data-aos-delay="200"
                                data-aos-duration="2500"
                            >
                                <img
                                    src={menu.imageUrl}
                                    alt=".."
                                    class="img-fluid"
                                />

                                <ul
                                    class="list-group list-group-flush mt-3 mb-0"
                                >
                                    <li class="list-group-item small">
                                        <span class="float-left">
                                            <i
                                                class="bx bx-bowl-hot bx-border-circle oyen"
                                            ></i>
                                        </span>
                                        <span class="float-right">
                                            {menu.nama_produk}
                                        </span>
                                    </li>
                                    <li class="list-group-item small">
                                        <span class="float-left">
                                            <i
                                                class="bx bx-wallet-alt bx-border-circle oyen"
                                            ></i>
                                        </span>
                                        <span class="float-right">
                                            {formatharga(menu.harga)} / {menu.satuan}
                                        </span>
                                    </li>
                                </ul>
                                <p>
                                    <button
                                        title="detail menu"
                                        class="btn btn-white btn-sm mt-2"
                                        on:click={() => menuDetail(menu.id)}
                                    >
                                        <i
                                            class="bx bxs-message-square-dots oyen"
                                        ></i>
                                        Detail Menu
                                    </button>
                                </p>

                                <!-- Preorder -->
                                <div>
                                    {#if menu.preorder == true}
                                        <button
                                            on:click={() => openPreorder(menu)}
                                            class="btn btn-white"
                                            title="klik untuk preorder"
                                        >
                                            <i
                                                class="bx bxl-whatsapp oyen bx-border-circle"
                                            ></i>
                                            Preorder
                                        </button>
                                    {:else if orderCheck}
                                        <button
                                            on:click={() => addtoCart(menu)}
                                            class="btn btn-sm btn-light"
                                            title="hubungi penyedia"
                                        >
                                            <i
                                                class="bx bx-cart-add bx border-circle"
                                            ></i>
                                            Keranjang
                                        </button>
                                    {:else}
                                        <div class="small">
                                            <i
                                                class="bx bx-cart bx-border-circle"
                                            ></i>
                                            <p>Lapak Tutup</p>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <Phone />
</section>

<style>
    .detail_image {
        border-radius: 15px !important;
    }
    .btn,
    .form-control {
        border-radius: 25px !important;
    }
    .grid-menu {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 1px;
    }

    .grid-menu img {
        display: block;
        width: 100%;
    }

    @media (max-width: 576px) {
        .grid-menu {
            grid-template-columns: repeat(2, 1fr);
        }

        .image-detail {
            border-radius: 15px;
        }
        p {
            font-size: 1rem;
        }
    }
</style>
