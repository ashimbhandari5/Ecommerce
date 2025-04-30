import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  quantity: number;
}
