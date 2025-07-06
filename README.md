🧾 Deskripsi
Sistem ini merupakan aplikasi manajemen data pegawai menggunakan:

Frontend: ReactJs + Material MUI
Backend: Laravel 10
Database: MySQL

Fitur utama:

Tambah, edit, hapus pegawai, dan sistem login
Relasi antar entitas: Departemen, Posisi, Jabatan
Validasi email dan generate NIP otomatis
Tabel responsif dan tampilan modern

📁 Struktur Folder
bash
Salin
Edit
.
├── backend/         # Laravel project
├── frontend/        # React project


⚙️ Instalasi & Setup

🔹 Backend (Laravel)
bash
Download Zip
cd data-pegawai-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
Pastikan .env diatur sesuai koneksi database kamu.

🔹 Frontend (React)
bash
Download Zip
Edit
cd data-peegawai-frontend
npm install
npm start
⚠️ Pastikan API localhost:8000 sudah jalan sebelum menjalankan React.

🔐 Autentikasi (Opsional)
Jika ingin menambahkan login, gunakan Laravel Sanctum atau JWT di backend, dan simpan token di frontend via localStorage.
Akun Testing login 

Email : admin@example.com
Password : Yahoo365

📌 API Endpoint Penting
Method	Endpoint	Keterangan
GET	/api/employees	List pegawai
POST	/api/employees	Tambah pegawai
PUT	/api/employees/{id}	Update pegawai
DELETE	/api/employees/{id}	Hapus pegawai
POST	/api/employees/check-email	Cek email unik
GET	/api/nip/generate	Generate NIP otomatis
GET	/api/departments	List departemen
GET	/api/positions	List posisi (filter by departemen)
GET	/api/job_titles	List jabatan

📷 Screenshots (Opsional)
Tambahkan screenshot UI pegawai, form tambah/edit, dan validasi.

👨‍💻 Author
Nama: [Ikbal Ardiansah]
GitHub: github.com/anuterbang

Thankyou
