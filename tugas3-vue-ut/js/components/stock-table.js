Vue.component('ba-stock-table', function(resolve, reject) {
    fetch('/templates/stock-table.html')
        .then(res => res.text())
        .then(html => {
            resolve({
                template: html,
                props: ['items', 'upbjjList', 'kategoriList'],
                data() {
                    return {
                        filterUpbjj: '', filterKategori: '', filterReorder: false, sortBy: '',
                        editIndex: -1, editForm: {},
                        formBaru: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '' }
                    };
                },
                filters: {
                    currencyRp(val) { return 'Rp ' + Number(val).toLocaleString('id-ID'); },
                    formatBuah(val) { return val + ' buah'; }
                },
                watch: {
                    // Watcher 2: Dependent Options Filter
                    // Jika UT-Daerah (filterUpbjj) direset/diubah, kosongkan juga pilihan Kategori
                    filterUpbjj(newVal) {
                        if (!newVal) this.filterKategori = '';
                    }
                },
                computed: {
                    // Computed Property untuk Filtering & Sorting Data Array
                    // Computed lebih baik dari Method karena nilainya di-cache (tidak recompute berulang-ulang)
                    sortedFilteredData() {
                        let result = this.items;
                        if (this.filterUpbjj) result = result.filter(i => i.upbjj === this.filterUpbjj);
                        if (this.filterKategori) result = result.filter(i => i.kategori === this.filterKategori);
                        if (this.filterReorder) result = result.filter(i => i.qty < i.safety || i.qty === 0);
                        
                        if (this.sortBy === 'judul') result.sort((a,b) => a.judul.localeCompare(b.judul));
                        if (this.sortBy === 'qty') result.sort((a,b) => a.qty - b.qty);
                        if (this.sortBy === 'harga') result.sort((a,b) => a.harga - b.harga);
                        return result;
                    }
                },
                methods: {
                    resetFilter() {
                        this.filterUpbjj = ''; this.filterKategori = ''; 
                        this.filterReorder = false; this.sortBy = '';
                    },
                    hapusData(idx, item) {
                        this.$root.$refs.modal.buka("Konfirmasi Hapus", `Apakah Anda yakin menghapus ${item.judul}?`, () => {
                            const realIdx = this.items.findIndex(i => i.kode === item.kode);
                            if(realIdx > -1) {
                                this.items.splice(realIdx, 1);
                                this.$root.$refs.modal.peringatan("Berhasil", "Data bahan ajar telah dihapus.");
                            }
                        });
                    },
                    mulaiEdit(idx, item) {
                        this.editIndex = idx; this.editForm = Object.assign({}, item);
                    },
                    simpanEdit(idx) {
                        // Validasi sederhana untuk update data
                        if (!this.editForm.judul || !this.editForm.lokasiRak || this.editForm.harga === '' || this.editForm.qty === '') {
                            return this.$root.$refs.modal.peringatan("Validasi Gagal ⚠️", "Field Judul, Rak, Harga, dan Stok tidak boleh kosong saat update!");
                        }

                        // Update langsung secara reaktif
                        const realIdx = this.items.findIndex(i => i.kode === this.editForm.kode);
                        if(realIdx > -1) Object.assign(this.items[realIdx], this.editForm);
                        
                        this.editIndex = -1;
                        this.$root.$refs.modal.peringatan("Update Berhasil ✅", "Data bahan ajar langsung ter-update dengan nilai terbaru.");
                    },
                    tambahData() {
                        if (!this.formBaru.kode || !this.formBaru.judul || !this.formBaru.upbjj) {
                            return this.$root.$refs.modal.peringatan("Validasi Gagal ⚠️", "Mohon isi Kode MK, Judul MK, dan UT-Daerah terlebih dahulu!");
                        }
                        this.items.push({
                            kode: this.formBaru.kode, judul: this.formBaru.judul, 
                            kategori: this.formBaru.kategori || '-', upbjj: this.formBaru.upbjj, 
                            lokasiRak: this.formBaru.lokasiRak || '-', harga: this.formBaru.harga || 0, 
                            qty: this.formBaru.qty || 0, safety: 10, catatanHTML: '<i>Data baru</i>'
                        });
                        this.formBaru = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '' };
                        this.$root.$refs.modal.peringatan("Berhasil ✅", "Data bahan ajar baru telah berhasil ditambahkan.");
                    }
                }
            });
        }).catch(err => reject(err));
});