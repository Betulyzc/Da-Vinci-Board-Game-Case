import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;   


  @IsString()
  @IsNotEmpty()
  title: string;
}