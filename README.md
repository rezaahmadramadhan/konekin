# KonekIn - Professional Social Media Application

KonekIn adalah aplikasi mobile berbasis React Native yang mengimplementasikan konsep social media untuk jaringan profesional, mirip dengan LinkedIn. Aplikasi ini memungkinkan pengguna untuk terhubung dengan profesional lain, berbagi konten, berinteraksi melalui komentar dan likes, serta membangun jaringan profesional.

## 📱 Fitur Utama

### Autentikasi Pengguna
- **Registrasi**: Pengguna dapat mendaftar dengan memberikan nama lengkap, username, email, dan password.
- **Login**: Pengguna yang sudah terdaftar dapat masuk ke aplikasi dengan username dan password.
- **Secure Authentication**: Menggunakan JSON Web Token (JWT) dan Expo Secure Store untuk menyimpan data autentikasi dengan aman.

### Beranda (Home)
- **Feed Post**: Menampilkan daftar post dari semua pengguna, diurutkan berdasarkan yang terbaru.
- **Pencarian**: Fitur pencarian untuk menemukan post berdasarkan konten atau tags.
- **Pull to Refresh**: Memperbarui feed dengan menarik layar ke bawah.

### Pembuatan Konten
- **Membuat Post**: Pengguna dapat membuat post baru dengan teks, tag, dan gambar (URL).
- **Tag System**: Mendukung penggunaan tag untuk mengkategorikan konten.

### Interaksi Sosial
- **Like Post**: Pengguna dapat menyukai post.
- **Komentar**: Pengguna dapat menambahkan komentar pada post.
- **Detail Post**: Menampilkan post secara detail, termasuk semua komentar dan jumlah like.
- **Berbagi Post**: Opsi untuk membagikan post (dalam pengembangan).

### Jaringan (Network)
- **Follow User**: Kemampuan untuk mengikuti pengguna lain.
- **Followers & Following**: Melihat daftar pengikut dan yang diikuti.
- **Pencarian Pengguna**: Menemukan pengguna berdasarkan nama atau username.

### Profil Pengguna
- **Informasi Profil**: Menampilkan informasi dasar pengguna seperti nama, username, dan email.
- **Statistik Jaringan**: Menampilkan jumlah followers dan following.
- **Post Pengguna**: Menampilkan post yang dibuat oleh pengguna.

## 🔧 Teknologi yang Digunakan

### Frontend (Mobile)
- **React Native**: Framework utama untuk pengembangan aplikasi mobile
- **Expo**: Platform untuk memudahkan pengembangan React Native
- **Apollo Client**: Untuk komunikasi dengan GraphQL server
- **React Navigation**: Sistem navigasi dalam aplikasi (Stack dan Tab Navigator)
- **Context API**: State management untuk autentikasi pengguna
- **Expo Secure Store**: Penyimpanan aman untuk token autentikasi

### Backend (Server)
- **Apollo Server**: Server GraphQL untuk mengelola API
- **MongoDB**: Database untuk menyimpan data pengguna, post, like, komentar, dan relasi following
- **Redis**: Sistem caching untuk meningkatkan performa query
- **JSON Web Token (JWT)**: Untuk autentikasi dan otorisasi
- **Bcrypt**: Untuk enkripsi password

## 📊 Struktur Data

### User
- ID
- Nama
- Username
- Email
- Password (terenkripsi)
- Relasi followers/following

### Post
- ID
- Konten
- Tags
- URL Gambar (opsional)
- ID Author
- Data Author (nama, username)
- Likes (username, waktu)
- Komentar (konten, username, waktu)

### Follow
- ID
- ID Follower
- ID Following
- Timestamp

## 🚀 Fitur API GraphQL

### Query
- **Login**: Autentikasi pengguna
- **Get Posts**: Mengambil daftar post terbaru
- **Get Post by ID**: Mendapatkan detail post
- **Find User**: Pencarian pengguna berdasarkan nama/username
- **Find User by ID**: Mendapatkan profil pengguna

### Mutation
- **Register**: Pendaftaran pengguna baru
- **Add Post**: Menambahkan post baru
- **Comment Post**: Menambahkan komentar pada post
- **Like Post**: Menyukai/unlike post
- **Follow User**: Mengikuti pengguna lain

## 💻 Pengembangan dan Deployment

### Pengembangan
- Aplikasi client dibangun menggunakan Expo, memudahkan pengembangan dan testing di berbagai perangkat
- Server GraphQL menggunakan Apollo Server yang dioptimalkan dengan caching Redis
- Database MongoDB menyediakan fleksibilitas dalam penyimpanan data dan relasi

### Instalasi dan Running

#### Client (App)
```bash
cd app
npm install
npm start
```

#### Server
```bash
cd server
npm install
npm start
```

## 📱 Antarmuka Pengguna

### Login dan Registrasi
- Antarmuka login yang bersih dan profesional dengan logo KonekIn
- Form registrasi lengkap dengan validasi input
- Navigasi yang mudah antara login dan registrasi

### Beranda dan Feed
- Tampilan feed dengan kartu post yang modern
- Gambar profil pengguna dan informasi post
- Tombol interaksi (like, comment, share) yang mudah diakses

### Detail Post dan Komentar
- Tampilan detail post dengan semua interaksi dan komentar
- Form komentar yang responsif
- Indikator jumlah like dan komentar

### Profil Pengguna
- Tampilan profil dengan informasi pengguna
- Statistik followers dan following
- Daftar post yang telah dibuat

## 📝 Status Pengembangan
Aplikasi KonekIn saat ini dalam tahap pengembangan aktif. Beberapa fitur dalam roadmap:
- Fitur berbagi post ke platform lain
- Notifikasi real-time
- Fitur pesan langsung antar pengguna
- Peningkatan UI/UX dan performa

## 🌐 Arsitektur Sistem
- **Client-Server**: Aplikasi menggunakan arsitektur client-server dengan React Native di sisi client dan Apollo Server di sisi server
- **GraphQL**: API GraphQL untuk komunikasi data yang efisien antara client dan server
- **Authentication Flow**: Sistem autentikasi dengan JWT dan penyimpanan token di Secure Store

---

Dibuat sebagai bagian dari project Hacktiv8 - Phase 3
