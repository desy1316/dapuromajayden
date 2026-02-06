<script>
    import { formatharga } from "../helper";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import { daftaritem } from "../store/store";
    const pagename = "Keranjang Saya";
    let datakeranjang = [];
    let loading = true;
    let errors = {};
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";

    let nama_pemesan = "";
    let nomor_kontak = "";

    function getKeranjangBelanja() {
        let data = JSON.parse(localStorage.getItem("cart")) || [];
        datakeranjang = data;
    }

    function hapusitem(menu) {
        daftaritem.update((items) => {
            const updatedItems = items.filter((item) => item.id !== menu.id);
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            return updatedItems;
        });

        getKeranjangBelanja();
    }

    function ubahQty(menu, delta) {
        daftaritem.update((items) => {
            const idx = items.findIndex((item) => item.id === menu.id);
            if (idx !== -1) {
                items[idx].qty += delta;
                items[idx].subtotal = items[idx].harga * items[idx].qty;
            }
            return items;
        });
        getKeranjangBelanja();
    }

    function validationPemesan() {
        errors = {};

        if (!nama_pemesan) {
            errors.nama_pemesan = "Nama wajib di isi ";
        }

        if (!nomor_kontak) {
            errors.nomor_kontak = "Nomor Kontak Harus di isi";
        }

        return Object.keys(errors).length === 0;
    }

    function generateInvoicePDF(invoiceId, tanggal, items, total) {
        // Set ukuran kertas A5 (Setengah A4)
        const doc = new jsPDF("p", "mm", "a5");

        // Header
        doc.setFontSize(18);
        doc.text("INVOICE PEMBELIAN", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text("DapurOmaJayden", 14, 30);

        // Invoice Info
        doc.text(`Invoice ID: ${invoiceId}`, 14, 45);
        doc.text(`Tanggal: ${tanggal}`, 14, 50);
        doc.text(`Nama Pemesan: ${nama_pemesan}`, 14, 55);
        doc.text(`Nomor Kontak: ${nomor_kontak}`, 14, 60);

        // Table headers
        const tableColumn = ["Produk", "Harga", "Qty", "Subtotal"];
        const tableRows = [];

        items.forEach((item) => {
            const row = [
                item.nama_produk,
                `Rp ${formatharga(item.harga)}`,
                item.qty,
                `Rp ${formatharga(item.subtotal)}`,
            ];
            tableRows.push(row);
        });

        // Add Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            theme: "grid",
        });

        // Total
        const finalY = doc.lastAutoTable.finalY || 80;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Total Bayar: Rp ${formatharga(total)}`, 14, finalY + 15);

        // Footer Note
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
            "Bawa invoice ini untuk melakukan Pengambilan Pesanan",
            14,
            finalY + 25,
        );

        // Save PDF
        doc.save(`Invoice-${invoiceId}.pdf`);
    }

    function checkOutBelanja() {
        if (!validationPemesan()) return;

        // 1. Generate Invoice ID & Date
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        // Random 3 digit number for uniqueness
        const randomNum = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");

        const invoiceId = `INV-${year}${month}${day}-${randomNum}`;
        const tanggalTransaksi = now.toLocaleString("id-ID", {
            dateStyle: "full",
            timeStyle: "short",
        });

        generateInvoicePDF(
            invoiceId,
            tanggalTransaksi,
            datakeranjang,
            totalbayar,
        );

        // 3. Format Message for WhatsApp
        let message = `*INVOICE BARU*\n`;
        message += `--------------------------------\n`;
        message += `ID Invoice: ${invoiceId}\n`;
        message += `Tanggal: ${tanggalTransaksi}\n`;
        message += `Nama: ${nama_pemesan}\n`;
        message += `Kontak: ${nomor_kontak}\n`;
        message += `--------------------------------\n`;
        message += `*DAFTAR PESANAN:*\n`;

        datakeranjang.forEach((item) => {
            message += `- ${item.nama_produk} (x${item.qty}) : Rp ${formatharga(item.subtotal)}\n`;
        });

        message += `--------------------------------\n`;
        message += `*TOTAL BAYAR: Rp ${formatharga(totalbayar)}*\n`;
        message += `--------------------------------\n`;
        message += `Mohon diproses, Terima kasih!`;

        const nomorAdmin = "6282147674339";

        const waLink = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`;

        setTimeout(() => {
            window.open(waLink, "_blank");

            localStorage.removeItem("cart");
            daftaritem.set([]);
            datakeranjang = [];
        }, 1500);
    }

    let orderCheck;
    function bolehOrder() {
        const waktu = new Date();
        const hari = waktu.getDay();
        const jam = waktu.getHours();

        orderCheck = jam >= 6 && jam <= 10 && hari >= 1 && hari <= 5;
    }

    onMount(() => {
        bolehOrder();
        getKeranjangBelanja();
        setTimeout(() => {
            loading = false;
        }, 3500);
    });
    $: totalbayar = datakeranjang.reduce(
        (sum, mydata) => sum + mydata.subtotal,
        0,
    );
</script>

<section class="keranjangBelanja mb-5 pb-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h4>
                    <i class="bx bx-cart bx-border-circle"></i>
                    {pagename}
                </h4>
                <hr />
            </div>
        </div>
    </div>
    <div class="container">
        {#if orderCheck}
            <div class="row">
                {#if loading}
                    <div class="col-lg-12">
                        <p class="text-left">
                            <i class="bx bx-loader bx-spin"></i>
                            Sedang Memuat Data....
                        </p>
                    </div>
                {:else if datakeranjang.length < 1}
                    <div class="col-lg-12">
                        <div class="my-4 text-center">
                            <h4 class="my-2">
                                Keranjang Kamu masih Kosong bree....
                            </h4>
                            <button
                                class="btn btn-oyen btn-lg"
                                on:click={() => push("/")}
                            >
                                <i class="bx bx-undo"></i>
                                Lihat Menu
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="container-fluid">
                        <div class="card">
                            <div class="card-body">
                                <div class="row justify-content-between">
                                    <div class="col-lg-4 text-center kasirdata">
                                        <div class="container mt-3">
                                            <div
                                                class="alert alert-secondary shadow-sm"
                                            >
                                                <h5 class="alert-heading mb-3">
                                                    Halo Kak 👋
                                                </h5>

                                                <p class="mb-3">
                                                    Tinggal sedikit lagi untuk
                                                    menyelesaikan pesanan kamu.
                                                </p>

                                                <!-- Tombol show/hide cuma muncul di HP -->
                                                <button
                                                    class="btn btn-sm btn-outline-dark d-block d-lg-none mb-3 w-100"
                                                    type="button"
                                                    data-toggle="collapse"
                                                    data-target="#infoPemesanan"
                                                    aria-expanded="false"
                                                    aria-controls="infoPemesanan"
                                                >
                                                    Lihat Cara Pemesanan <i
                                                        class="bx bx-chevron-down"
                                                    ></i>
                                                </button>

                                                <!-- Konten di-collapse cuma di HP (pake class collapse d-lg-block) -->
                                                <div
                                                    class="collapse d-lg-block"
                                                    id="infoPemesanan"
                                                >
                                                    <ul class="list-group">
                                                        <li
                                                            class="list-group-item"
                                                        >
                                                            <div
                                                                style="font-weight: lighter;"
                                                            >
                                                                1. Silakan ubah
                                                                jumlah pesanan
                                                            </div>
                                                            <br />
                                                            Pastikan jumlah item
                                                            sudah sesuai dengan yang
                                                            kakak mau.
                                                        </li>

                                                        <li
                                                            class="list-group-item"
                                                        >
                                                            <div
                                                                style="font-weight: lighter;"
                                                            >
                                                                2. Isi data
                                                                pemesan
                                                            </div>
                                                            <br />
                                                            Masukkan
                                                            <b>Nama Pemesan</b>
                                                            dan
                                                            <b>Nomor Kontak</b> yang
                                                            bisa dihubungi.
                                                        </li>

                                                        <li
                                                            class="list-group-item"
                                                        >
                                                            <div
                                                                style="font-weight: lighter;"
                                                            >
                                                                3. Checkout
                                                                Pesanan
                                                            </div>
                                                            <br />
                                                            Setelah tombol
                                                            <b>Checkout</b>
                                                            diklik:
                                                            <ul
                                                                class="mt-2 mb-0"
                                                            >
                                                                <li>
                                                                    Invoice akan <b
                                                                        >otomatis
                                                                        terdownload</b
                                                                    >
                                                                </li>
                                                                <li>
                                                                    Akan
                                                                    diarahkan ke <b
                                                                        >WhatsApp
                                                                        penyedia
                                                                        jasa</b
                                                                    > untuk konfirmasi
                                                                    pesanan
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <!-- End Collapse -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <h4>Daftar Pesanan Saya</h4>
                                        <hr />

                                        <div class="table-responsive">
                                            <table
                                                class="table table-borderless"
                                            >
                                                <thead>
                                                    <tr>
                                                        <td>Menu</td>
                                                        <td>Harga</td>
                                                        <td class="text-center"
                                                            >Qty</td
                                                        >
                                                        <td>Subtotal</td>
                                                        <td>Aksi</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {#each datakeranjang as psn}
                                                        <tr>
                                                            <td
                                                                >{psn.nama_produk}</td
                                                            >
                                                            <td
                                                                >{formatharga(
                                                                    psn.harga,
                                                                )}</td
                                                            >
                                                            <td>
                                                                <div
                                                                    class="d-flex justify-content-between align-items-center"
                                                                >
                                                                    <!-- decrease qty -->
                                                                    <button
                                                                        on:click={() =>
                                                                            ubahQty(
                                                                                psn,
                                                                                -1,
                                                                            )}
                                                                        disabled={psn.qty ===
                                                                            1}
                                                                        title="kurangi jumlah item"
                                                                        class="btn btn-sm btn-light"
                                                                    >
                                                                        <i
                                                                            class="bx bx-minus"
                                                                        ></i>
                                                                    </button>

                                                                    <span>
                                                                        {psn.qty}
                                                                    </span>

                                                                    <!-- increase qty -->
                                                                    <button
                                                                        on:click={() =>
                                                                            ubahQty(
                                                                                psn,
                                                                                1,
                                                                            )}
                                                                        title="tambah jumlah item"
                                                                        class="btn btn-sm btn-light"
                                                                    >
                                                                        <i
                                                                            class="bx bx-plus"
                                                                        ></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td
                                                                class="text-center"
                                                                >{formatharga(
                                                                    psn.subtotal,
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    on:click={() =>
                                                                        hapusitem(
                                                                            psn,
                                                                        )}
                                                                    title="hapus item"
                                                                    class="btn btn-sm btn-light"
                                                                >
                                                                    <i
                                                                        class="bx bx-trash"
                                                                    ></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="text-right p-3">
                                            <h5 class="font-weight-bold">
                                                <i
                                                    class="bx bx-wallet bx-border-circle"
                                                ></i>
                                                Grand Total Rp.
                                                {formatharga(totalbayar)}
                                            </h5>
                                        </div>

                                        <div class="my-4">
                                            <h4>Data Pemesan</h4>
                                            <hr />
                                            <div class="form-group row">
                                                <div class="col-lg-4">
                                                    <label
                                                        for="nama_pemesan"
                                                        class="col-form-label"
                                                    >
                                                        Nama Pemesan
                                                    </label>
                                                </div>
                                                <div class="col-lg-8">
                                                    <input
                                                        type="text"
                                                        placeholder="Nama Anda"
                                                        class="form-control form-control-lg"
                                                        bind:value={
                                                            nama_pemesan
                                                        }
                                                    />
                                                    {#if errors.nama_pemesan}
                                                        <span
                                                            class="small text-danger"
                                                        >
                                                            <i
                                                                class="bx bx-error-circle"
                                                            ></i>
                                                            {errors.nama_pemesan}
                                                        </span>
                                                    {/if}
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-lg-4">
                                                    <label
                                                        for="nomor_kontak"
                                                        class="text-muted col-form-label"
                                                    >
                                                        Nomor Kontak
                                                    </label>
                                                </div>
                                                <div class="col-lg-8">
                                                    <input
                                                        type="text"
                                                        placeholder="Nomor Kontak"
                                                        class="form-control form-control-lg"
                                                        bind:value={
                                                            nomor_kontak
                                                        }
                                                    />
                                                    {#if errors.nomor_kontak}
                                                        <span
                                                            class="small text-danger"
                                                        >
                                                            <i
                                                                class="bx bx-error-circle"
                                                            ></i>
                                                            {errors.nomor_kontak}
                                                        </span>
                                                    {/if}
                                                </div>
                                            </div>

                                            <div
                                                class="row justify-content-end"
                                            >
                                                <div class="col-lg-8">
                                                    <button
                                                        class="btn btn-lg btn-oyen btn-block"
                                                        on:click={checkOutBelanja}
                                                    >
                                                        <i
                                                            class="bx bx-cart-alt"
                                                        ></i>
                                                        CheckOut
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <h5 class="text-center my-4">
                <i class="bx bx-store-alt oyen bx-border-circle"></i>
                Lapak Tutup ,Buka Jam 6 Pagi
            </h5>
            <div class="text-center">
                <button on:click={() => push("/")} class="btn btn-lg btn-oyen">
                    Kembali
                </button>
            </div>
        {/if}
    </div>
</section>

<style>
    .card {
        border-radius: 20px;
    }

    .btn,
    .form-control {
        border-radius: 10px;
    }

    @media (max-width: 576px) {
        table {
            font-size: 0.9rem;
        }
    }
</style>
