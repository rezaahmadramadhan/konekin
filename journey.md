# Journey

## Day 1

### Setup Project: Tema Aplikasi, Apollo Server, GraphQL
Silahkan setup project aplikasi server kamu:
- [x] Install MongoDB database pada komputer kamu atau menggunakan MongoDB Atlas
- [x] Install package yang dibutuhkan: @apollo/server, graphql dan mongodb sebagai MongoDB driver
- [x] Pilih tema sesuai dengan pilihan dan kesepakatan instructor, tuliskan dalam README github kamu
- [x] Buatlah aplikasi server GraphQL menggunakan Apollo Server dengan PORT default: 3000


### GraphQL - Apollo Server
Buatlah Aplikasi server GraphQL dengan menggunakan Apollo Server yang memiliki fungsi sebagai berikut:
- [x] Register (Mutation)
- [x] Login (Query)
- [x] Get Post (Query)
- [x] Add Post (Mutation)
- [x] Comment Post (Mutation)
- [x] Search User (Query)
- [x] Follow (Mutation)
- [x] Get User (Query)
- [x] Like Post (Mutation)

### MongoDB 1
Buatlah fungsi/method pada aplikasi server GraphQL kamu yang menghubungkan dengan database MongoDB dengan fungsi sebagai berikut:
- [x] Add user: untuk kebutuhan register
- [ ] Get user by username dan password: untuk kebutuhan login
- [x] Search users by name/username: untuk kebutuhan mencari user berdasarkan nama atau username
- [x] Follow User: untuk kebutuhan memfollow user
- [x] Get User by Id: untuk menampilkan profile user
- [x] Add Post: untuk menambahkan post baru
- [x] Get Posts: mengambil daftar post berdasarkan yang terbaru
- [x] Get Post by Id: mengambil post berdasarkan id
- [x] Comment Post: untuk menambahkan komentar pada post
- [x] Like Post: untuk menambahkan like pada post


## Day 2

### MongoDB 2
Buatlah lookup/relasi pada method/fungsi yang berhubungan dengan MongoDB yang sudah kamu buat dengan rincian sebagai berikut:
- [x] Get Post by Id: mengambil post berdasarkan id
  - [x] Menampilkan nama/username user pada data komentar

- [x] Get User by Id: untuk menampilkan profile user
  - [x] Menampilkan list nama/username user follower
  - [x] Menampilkan list nama/username user following


### Redis - Cache
Implementasikan cache pada aplikasi GraphQL server yang sudah dibuat dengan detail sebagai berikut:
- [x] Implementasikan cache pada Get Post (Query)
- [x] Invalidate cache pada Add Post (Mutation)

## Day 3
### React Native
Buatlah aplikasi mobile React-Native dengan menggunakan expo. Aplikasi ini adalah client side dari challenge My Social Media App.
Pada aplikasi ini kamu perlu membuat screen sebagai berikut:
- [x] Unauthenticate screen
  - [x] Login Screen: Menampilkan form untuk login
  - [x] Register Screen: Menampilkan form untuk register

- [x] Authenticate screen
  - [x] Home screen: Menampilkan list post
  - [x] Create Post: Menampilkan form untuk menambahkan post baru
  - [x] Post Detail Screen: Menampilkan post detail berdasarkan id dan form untuk komentar
  - [x] Search Screen: Menampilkan form pencarian untuk mencari user (bisa digabung dengan screen lain)
  - [x] Profile Screen: Menampilkan profile user berdasarkan id, serta menampilkan jumlah followings dan followers user.


### React Navigation
 - [x] Implementasikan navigasi pada screen yang sudah kamu buat dengan menggunakan React Navigation.


## Day 4
### GraphQL - Apollo Client
Lakukan komunikasi Aplikasi Mobile (react-native) menggunakan apollo client ke server GraphQL  yang sudah dibuat. Dan Implementasikan query dan mutation sesuai dengan kebutuhan.
- [x] Register (Mutation)
- [x] Login (Query)
- [x] Login (Query)
- [x] Login (Query)
- [x] Login (Query)
- [x] Get Post (Query)
- [x] Add Post (Mutation)
- [x] Comment Post (Mutation)
- [x] Search User (Query)
- [x] Follow (Mutation)
- [x] Get User (Query)
- [x] Like Post (Mutation)

