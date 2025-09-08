import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PostsService } from '../posts/posts.service';


@Injectable()
export class UsersService {
  constructor(private readonly postsService: PostsService) {}
  private users: User[] = [
    { id: 1, name: 'Betül Yazıcı', username: 'betul', email: 'betul@example.com' },
    { id: 2, name: 'Ali Tekin', username: 'alitek', email: 'ali@example.com' },
    { id: 3, name: 'Kemal Lale', username: 'kemal', email: 'kemal@example.com' },
    { id: 4, name: 'Ayşe Demir', username: 'ayse', email: 'ayse@example.com' },
    { id: 5, name: 'Mehmet Yıldız', username: 'mehmet', email: 'mehmet@example.com' },
    { id: 6, name: 'Zeynep Kaya', username: 'zeynep', email: 'zeynep@example.com' },
    { id: 7, name: 'Ahmet Çelik', username: 'ahmet', email: 'ahmet@example.com' },
    { id: 8, name: 'Elif Arslan', username: 'elif', email: 'elif@example.com' },
    { id: 9, name: 'Murat Aksoy', username: 'murat', email: 'murat@example.com' },
    { id: 10, name: 'Fatma Şahin', username: 'fatma', email: 'fatma@example.com' },
    { id: 11, name: 'Hasan Koç', username: 'hasan', email: 'hasan@example.com' },
    { id: 12, name: 'Selin Yılmaz', username: 'selin', email: 'selin@example.com' },
    { id: 13, name: 'Okan Demirtaş', username: 'okan', email: 'okan@example.com' },
    { id: 14, name: 'Cemre Aydın', username: 'cemre', email: 'cemre@example.com' },
    { id: 15, name: 'Burak Güneş', username: 'burak', email: 'burak@example.com' },
  ];
  
  private nextId(): number {
    const max = this.users.length ? Math.max(...this.users.map(u => u.id)) : 0;
    return max + 1;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const maxId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) : 0;
    const newUser: User = {
      id: maxId + 1,  
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: number): { deleted: true } {
    this.findOne(id); 
    this.users = this.users.filter(u => u.id !== id);

    this.postsService.removeByUserId(id);

    return { deleted: true };
  }
}
