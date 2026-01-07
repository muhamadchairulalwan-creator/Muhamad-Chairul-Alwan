// Fungsi Pembantu: Mengelola data user
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

// 1. Fungsi Sign Up
function handleSignUp() {
    // Pastikan ID ini ada di HTML signup.html (id="signupFullname", dll)
    const fullname = document.getElementById('signupFullname')?.value;
    const username = document.getElementById('signupUsername')?.value;
    const password = document.getElementById('signupPassword')?.value;

    if (!fullname || !username || !password) {
        alert("Semua field wajib diisi.");
        return;
    }

    const users = getUsers();
    if (users.some(user => user.username === username)) {
        alert("Username sudah digunakan.");
        return;
    }

    users.push({ fullname, username, password });
    saveUsers(users);
    alert("Pendaftaran berhasil! Silakan Sign In.");
    window.location.href = 'index.html';
}

// 2. Fungsi Sign In
function handleSignIn() {
    const username = document.getElementById('loginUsername')?.value;
    const password = document.getElementById('loginPassword')?.value;

    const userFound = getUsers().find(u => u.username === username && u.password === password);

    if (userFound) {
        localStorage.setItem('currentUser', userFound.fullname); 
        // Ini sudah benar
        setTimeout(() => window.location.href = 'dashboard.html', 100); 
    } else {
        alert("Username atau Password salah.");
    }
}

// 3. Jam Real-time Modern (Perbaikan agar tidak delay 1 detik di awal)
function updateClock() {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    
    if (clockEl && dateEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('id-ID', { hour12: false });
        dateEl.innerText = now.toLocaleDateString('id-ID', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }
}
if (document.getElementById('live-clock')) {
    updateClock(); // Jalankan langsung
    setInterval(updateClock, 1000); // Lalu jalankan tiap detik
}

// 4. Fungsi Submit Absen
function submitAbsen(tipe) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const now = new Date();
    const newLog = {
        user: currentUser,
        tanggal: now.toLocaleDateString('id-ID'),
        waktu: now.toLocaleTimeString('id-ID'),
        tipe: tipe
    };

    let logs = JSON.parse(localStorage.getItem('absensiLogs')) || [];
    logs.push(newLog);
    localStorage.setItem('absensiLogs', JSON.stringify(logs));
    
    // Perbarui tampilan status di dashboard jika ada
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) statusBadge.innerText = `Status: Sudah Absen ${tipe}`;
    
    alert(`Berhasil Absen ${tipe}!`);
}

// 5. Proteksi Halaman & Logout
function handleLogout() {
    localStorage.removeItem('currentUser'); // Hapus sesi login
    
    // Alihkan user ke halaman login.html
    window.location.href = 'login.html'; 
}

/*
if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('laporan.html')) {
    if (!localStorage.getItem('currentUser')) {
        // UBAH BARIS INI DARI 'index.html' MENJADI 'login.html'
        window.location.href = 'login.html'; 
    }
}
*/


// 6. Menampilkan Data di Tabel Laporan & Rekap Summary
if (document.getElementById('attendance-log')) {
    const tableBody = document.getElementById('attendance-log');
    const logs = JSON.parse(localStorage.getItem('absensiLogs')) || [];
    const currentUser = localStorage.getItem('currentUser');
    
    // Filter log hanya untuk user yang sedang login
    const userLogs = logs.filter(log => log.user === currentUser);

    let totalMasuk = 0;
    let totalPulang = 0;

    if (userLogs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Belum ada data absensi untuk Anda.</td></tr>';
    } else {
        userLogs.forEach(item => {
            if (item.tipe === 'Masuk') totalMasuk++;
            if (item.tipe === 'Pulang') totalPulang++;

            let row = `<tr>
                <td>${item.user}</td>
                <td>${item.tanggal}</td>
                <td>${item.waktu}</td>
                <td><span class="badge-${item.tipe.toLowerCase()}">${item.tipe}</span></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
        
        // ISI SUMMARY REKAP DI HTML laporan.html
        document.getElementById('rekap-masuk').textContent = totalMasuk;
        document.getElementById('rekap-pulang').textContent = totalPulang;
    }
}

// 7. Menghapus Log
function clearLogs() {
    if (confirm("Hapus semua riwayat absensi? Aksi ini tidak bisa dibatalkan.")) {
        localStorage.removeItem('absensiLogs');
        location.reload(); // Muat ulang halaman setelah hapus log
    }
}
