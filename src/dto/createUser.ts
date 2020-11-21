import {
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';;
export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsOptional()
  elorank: number;
  
  @ApiProperty()
  @IsOptional()
  facebookId: string;
}
