import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    // Betül'ün görevleri
    { id: 1, userId: 1, title: 'Markete gidip haftalık alışverişi yap, özellikle kahvaltılıkları al' },
    { id: 2, userId: 1, title: 'Çamaşırları yıka, kurutmaya as ve ütülenecekleri ayır' },
    { id: 3, userId: 1, title: 'Okuduğun kitabın iki bölümünü oku ve önemli kısımların altını çiz' },

    // Ali'nin görevleri
    { id: 4, userId: 2, title: 'Spor salonuna git, kardiyo ve ağırlık çalışmanı tamamla' },
    { id: 5, userId: 2, title: 'Arkadaşınla kafede buluş ve sohbet et' },
    { id: 6, userId: 2, title: 'Elektrik ve su faturalarını öde, dekontlarını sakla' },

    // Kemal'in görevleri
    { id: 7, userId: 3, title: 'Bahçedeki çiçekleri sula ve solmuş yaprakları temizle' },
    { id: 8, userId: 3, title: 'Kahvaltı hazırla, sofrayı kur ve mutfağı toparla' },
    { id: 9, userId: 3, title: 'Evi süpür, özellikle salon ve mutfağı düzenle' },

    // Ayşe'nin görevleri
    { id: 10, userId: 4, title: 'Akşam için yemek pişir ve masayı hazırla' },
    { id: 11, userId: 4, title: 'Çocuğu okula bırak ve öğretmenle kısa bir görüşme yap' },
    { id: 12, userId: 4, title: 'Market alışverişi yap, özellikle sebze ve meyve al' },

    // Mehmet'in görevleri
    { id: 13, userId: 5, title: 'Kitaplıktaki kitapları yazar adına göre sırala' },
    { id: 14, userId: 5, title: 'Arabayı yıka ve içini süpür' },
    { id: 15, userId: 5, title: 'Sabah kahveni hazırla ve balkonda içerek keyif yap' },

    // Zeynep'in görevleri
    { id: 16, userId: 6, title: 'Matematik dersine çalış ve ödevleri tamamla' },
    { id: 17, userId: 6, title: 'Mutfak tezgahını sil ve dolapları düzenle' },
    { id: 18, userId: 6, title: 'Evdeki bitkilerin suyunu ver ve topraklarını kontrol et' },

    // Ahmet'in görevleri
    { id: 19, userId: 7, title: 'Bulaşıkları yıka ve makineyi boşalt' },
    { id: 20, userId: 7, title: 'Koşuya çık ve en az 3 kilometre tamamla' },
    { id: 21, userId: 7, title: 'Çöpü çıkar ve geri dönüşüm kutusunu ayır' },

    // Elif'in görevleri
    { id: 22, userId: 8, title: 'Haftalık alışveriş listesi hazırla' },
    { id: 23, userId: 8, title: 'Akşam için bir film seç ve izle' },
    { id: 24, userId: 8, title: '20 dakikalık yoga seansı yap' },

    // Murat'ın görevleri
    { id: 25, userId: 9, title: 'Balık tutmaya git ve günü sahilde geçir' },
    { id: 26, userId: 9, title: 'Kardeşini ziyaret et ve birlikte vakit geçir' },
    { id: 27, userId: 9, title: 'Telefonu şarja takmayı unutma' },

    // Fatma'nın görevleri
    { id: 28, userId: 10, title: 'Evde ekmek yapmayı dene' },
    { id: 29, userId: 10, title: 'Kitapçıya uğra ve yeni bir roman seç' },
    { id: 30, userId: 10, title: 'Kediyi besle ve suyunu değiştir' },

    // Burak'ın görevleri
    { id: 31, userId: 11, title: 'Sabah koşusuna çık ve nefes egzersizleri yap' },
    { id: 32, userId: 11, title: 'Toplantıya katıl ve notlar al' },
    { id: 33, userId: 11, title: 'Arkadaşlarınla oturup çay iç' },

    // Ayhan'ın görevleri
    { id: 34, userId: 12, title: 'Gazete oku ve gündemi takip et' },
    { id: 35, userId: 12, title: 'Komşuna uğra ve kısa bir sohbet et' },
    { id: 36, userId: 12, title: 'Bisiklete bin ve şehir turu yap' },

    // Melisa'nın görevleri
    { id: 37, userId: 13, title: 'Sevdiğin şarkıları dinle ve yeni playlist oluştur' },
    { id: 38, userId: 13, title: 'Resim yap ve çizim defterine yeni şeyler ekle' },
    { id: 39, userId: 13, title: 'Köpeği parka götür ve oynat' },

    // Hasan'ın görevleri
    { id: 40, userId: 14, title: 'Ailece kahvaltı yap' },
    { id: 41, userId: 14, title: 'İnternetten ilginç konuları araştır' },
    { id: 42, userId: 14, title: 'Arkadaşına mesaj at ve görüşme ayarla' },

    // Gülşah'ın görevleri
    { id: 43, userId: 15, title: 'Evin tozunu al ve eşyaları düzenle' },
    { id: 44, userId: 15, title: 'Kahve yap ve keyifli bir mola ver' },
    { id: 45, userId: 15, title: 'Deftere günlük yazısı yaz' },
  ];

  private nextId(): number {
    const max = this.posts.length ? Math.max(...this.posts.map(p => p.id)) : 0;
    return max + 1;
  }

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const post = this.posts.find(p => p.id === id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(dto: CreatePostDto): Post {
    const maxId = this.posts.length ? Math.max(...this.posts.map(p => p.id)) : 0;

    const newPost: Post = {
      id: maxId + 1,
      userId: dto.userId,  
      title: dto.title,
    };

    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, dto: UpdatePostDto): Post {
    const post = this.findOne(id);
    Object.assign(post, dto);
    return post;
  }

  remove(id: number): { deleted: true } {
    this.findOne(id); // yoksa NotFound fırlatır
    this.posts = this.posts.filter(p => p.id !== id);
    return { deleted: true };
  }

  removeByUserId(userId: number) {
  this.posts = this.posts.filter(p => p.userId !== userId);
  }
}
