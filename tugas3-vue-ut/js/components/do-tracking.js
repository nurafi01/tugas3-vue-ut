Vue.component('do-tracking', function(resolve, reject) {
    fetch('/templates/do-tracking.html')
        .then(res => res.text())
        .then(html => {
            resolve({
                template: html,
                props: ['data', 'pengirimanList', 'paketList'], // Data yang diterima dari app.js
                data() {
                    return {
                        cariQuery: '', hasilCari: null, hasilDO: '', progressBaru: '',
                        // Pastikan formDo ada di sini
                        formDo: { doNumber: '', nim: '', nama: '', ekspedisi: '', paketKode: '' },
                        infoPaket: null
                    };
                },
                // Filter: Untuk memformat angka mentah menjadi teks mata uang (Rp)
                filters: {
                    currencyRp(val) { return 'Rp ' + Number(val).toLocaleString('id-ID'); }
                },
                watch: {
                    // Watcher 1: Memantau pilihan paket
                    // Jika user memilih paket baru, otomatis cari detail isi paket tersebut
                    'formDo.paketKode': function(newVal) {
                        if (!newVal) { this.infoPaket = null; return; }
                        this.infoPaket = this.paketList.find(p => p.kode === newVal);
                    }
                },
                methods: {
                    jalankanCari() {
                        if(!this.cariQuery) return;
                        this.hasilCari = null;
                        
                        let found = this.data.find(t => {
                            let key = Object.keys(t)[0];
                            return key.toLowerCase() === this.cariQuery.toLowerCase() || t[key].nim === this.cariQuery;
                        });

                        if (found) {
                            this.hasilDO = Object.keys(found)[0];
                            this.hasilCari = found[this.hasilDO];
                        } else {
                            this.$root.$refs.modal.peringatan("Pencarian Gagal 🔍", `Data untuk DO atau NIM "${this.cariQuery}" tidak ditemukan.`);
                        }
                    },
                    resetCari() { 
                        this.cariQuery = ''; this.hasilCari = null; 
                    },
                    tambahProgress() {
                        if(!this.progressBaru) {
                            return this.$root.$refs.modal.peringatan("Validasi Gagal", "Keterangan status perjalanan tidak boleh kosong!");
                        }
                        const waktuSekarang = new Date().toLocaleString('id-ID');
                        this.hasilCari.perjalanan.push({ waktu: waktuSekarang, keterangan: this.progressBaru });
                        this.progressBaru = ''; 
                        this.$root.$refs.modal.peringatan("Update Berhasil", "Status perjalanan DO berhasil ditambahkan.");
                    },
                  generateDO() {
                        // Menggunakan tahun saat ini
                        const tahun = new Date().getFullYear();
                        
                        // Mengambil 4 digit angka acak berdasarkan waktu milidetik saat tombol diklik
                        const unik = Date.now().toString().slice(-4); 
                        
                        // Menggabungkannya menjadi nomor DO baru
                        const nomorBaru = `DO${tahun}-${unik}`;
                        
                        // Memaksa Vue untuk memperbarui tampilan di layar
                        this.$set(this.formDo, 'doNumber', nomorBaru);
                        
                        console.log("Nomor DO berhasil di-regenerate:", this.formDo.doNumber);
                    },
                    simpanDO() {
                        if (!this.formDo.nim || !this.formDo.paketKode || !this.formDo.ekspedisi) {
                            return this.$root.$refs.modal.peringatan("Data Tidak Lengkap ⚠️", "Harap lengkapi  NIM, Ekspedisi, dan Paket Bahan Ajar!");
                        }

                        this.$root.$refs.modal.buka("Konfirmasi ", `Apakah Anda yakin ingin melanjutkan pemesanan ${this.formDo.doNumber}?`, () => {
                            const date = new Date();
                            const tglKirim = new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).format(date);
                            
                            let DOBaru = {};
                            DOBaru[this.formDo.doNumber] = {
                                nim: this.formDo.nim, nama: this.formDo.nama, status: "Diproses",
                                ekspedisi: this.formDo.ekspedisi, tanggalKirim: tglKirim,
                                paket: this.formDo.paketKode, total: this.infoPaket.harga,
                                perjalanan: [{ waktu: date.toLocaleString('id-ID'), keterangan: "DO Dibuat & Menunggu Penjemputan Kurir" }]
                            };
                            
                            // GUNAKAN $SET PADA ARRAY DATA AGAR PANJANG DATA (LENGTH) TERDETEKSI BERTAMBAH
                            this.$set(this.data, this.data.length, DOBaru);
                            
                            // Reset input lainnya
                            this.formDo.nim = ''; this.formDo.nama = ''; 
                            this.formDo.ekspedisi = ''; this.formDo.paketKode = '';
                            
                            // Panggil generateDO lagi agar nomor langsung maju (contoh: 003 ke 004)
                            this.generateDO();

                            setTimeout(() => {
                                this.$root.$refs.modal.peringatan("DO Berhasil Dibuat 🚀", "Data Delivery Order telah berhasil disimpan ke sistem.");
                            }, 300);
                        });
                    }
                },
                mounted() {
                    // Panggil generateDO saat komponen dimuat pertama kali
                    this.generateDO();
                }
            });
        }).catch(err => reject(err));
});