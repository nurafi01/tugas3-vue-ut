Vue.component('app-modal', function(resolve, reject) {
    fetch('/templates/app-modal.html')
        .then(res => res.text())
        .then(html => {
            resolve({
                template: html,
                data() {
                    return { tampil: false, judul: '', pesan: '', callback: null, hanyaPeringatan: false };
                },
                methods: {
                    buka(judul, pesan, onConfirm) {
                        this.judul = judul; this.pesan = pesan;
                        this.callback = onConfirm; 
                        this.hanyaPeringatan = false; 
                        this.tampil = true;
                    },
                    peringatan(judul, pesan) {
                        this.judul = judul; this.pesan = pesan;
                        this.callback = null;
                        this.hanyaPeringatan = true; 
                        this.tampil = true;
                    },
                    tutup() { this.tampil = false; },
                    konfirmasi() {
                        if (this.callback) this.callback();
                        this.tutup();
                    }
                }
            });
        }).catch(err => reject(err));
});