# Backend - Da Vinci Board Game Case 

NestJS tabanlı backend API. Kullanıcılar (Users) ve Gönderiler (Posts) için CRUD işlemleri sağlar.  

## Teknolojiler
- NestJS (Node.js)  
- TypeScript  

##  Çalıştırma

### 1. Canlı test etmek için
- Backend Render üzerinde host edilmiştir:  
  -> [https://da-vinci-board-game-case.onrender.com](https://da-vinci-board-game-case.onrender.com)  

Örnek endpointler:  
- `GET /users` → tüm kullanıcıları listeler  
- `POST /users` → yeni kullanıcı ekler  
- `GET /posts` → tüm gönderileri listeler  
- `POST /posts` → yeni gönderi ekler  

### 2. Kendi bilgisayarında çalıştırmak için
```bash
cd backend
npm install
npm run start:dev
```

## Notlar
- Frontend, backend API’sine http://localhost:3000 (localde) veya Render’daki canlı link üzerinden istek atar.
- Kullanıcı silindiğinde ilgili tüm post’lar da otomatik olarak silinir (service entegrasyonu yapıldı).
