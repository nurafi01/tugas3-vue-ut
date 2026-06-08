const ApiService = {
    // Fungsi khusus untuk mengambil data dari file JSON dummy
    fetchDataBahanAjar() {
        return fetch('/data/dataBahanAjar.json')
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuat JSON');
                return response.json(); // Mengembalikan data dalam bentuk objek JavaScript
            });
    }
};