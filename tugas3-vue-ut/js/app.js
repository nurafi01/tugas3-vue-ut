// Menginisialisasi Vue Instance di root elemen dengan id="app"
new Vue({
    el: '#app',
    data: {
        tab: 'stok',
        state: {
            // Tempat menampung data array yang nanti diisi dari JSON
            stok: [], upbjjList: [], kategoriList: [],
            pengirimanList: [], paket: [], tracking: []
        }
    },
    // Lifecycle Hook 'created' dipanggil sesaat setelah Vue instance dibuat
    created() {
        // Memanggil layanan API yang sudah kita buat
        ApiService.fetchDataBahanAjar()
            .then(data => {
                this.state.stok = data.stok;
                this.state.upbjjList = data.upbjjList;
                this.state.kategoriList = data.kategoriList;
                this.state.pengirimanList = data.pengirimanList;
                this.state.paket = data.paket;
                this.state.tracking = data.tracking;
            })
            .catch(err => console.error("Gagal memuat JSON:", err));
    }
});