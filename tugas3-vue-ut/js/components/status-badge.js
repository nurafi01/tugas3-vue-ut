Vue.component('status-badge', function(resolve, reject) {
    fetch('/templates/status-badge.html')
        .then(res => res.text())
        .then(html => {
            resolve({
                template: html,
                props: ['qty', 'safety'],
                computed: {
                    teksStatus() {
                        if (this.qty === 0) return 'Kosong';
                        if (this.qty < this.safety) return 'Menipis';
                        return 'Aman';
                    },
                    warnaBadge() {
                        if (this.qty === 0) return 'bg-red';
                        if (this.qty < this.safety) return 'bg-orange';
                        return 'bg-green';
                    }
                }
            });
        }).catch(err => reject(err));
});