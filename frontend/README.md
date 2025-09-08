# Frontend - Da Vinci Board Game Case 

Bu proje React + TypeScript + Vite kullanılarak geliştirilmiş frontend uygulamasıdır.  
SPA routing için Vercel üzerinde `vercel.json` yapılandırması kullanılmıştır.  

## Teknolojiler
- React  
- TypeScript  
- Vite  
- TailwindCSS  
- Framer Motion  
- Lucide Icons  
- React Router  

## Çalıştırma

### 1. Canlı olarak test etmek için
- Frontend adresi: [da-vinci-board-game-case-rips.vercel.app](https://da-vinci-board-game-case-rips.vercel.app)  
- Uygulama backend API’sine `https://da-vinci-board-game-case.onrender.com` üzerinden istek atar.  

### 2. Kendi bilgisayarında çalıştırmak için

```bash
cd frontend
npm install
npm run dev
```

### SPA routing sorunu için kök dizinde vercel.json dosyası eklenmiştir:
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
