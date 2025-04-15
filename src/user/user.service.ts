import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  //   async findAll() {
  //     return this.prismaService.user.findMany({});
  //   }
  //   async findOne(id: number) {
  //     return `This action returns a #${id} user`;
  //   }

  //   async update(id: number, updateUserDto: UpdateUserDto) {
  //     return `This action updates a #${id} user`;
  //   }

  //   async remove(id: number) {
  //     return `This action removes a #${id} user`;
  //   }
  // }
  // Find all roles
  findAll() {
    return this.prismaService.user.findMany();
  }

  // Find a single user by ID
  async findOne(id: number) {
    return this.getUserById(id);
  }

  // Update an existing user
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.getUserById(id);

    if (await this.checkIfUserExist(updateUserDto.name, id)) {
      throw new BadRequestException(
        `User ${updateUserDto.name} has already been taken`,
      );
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // Delete a user
  async remove(id: number) {
    await this.getUserById(id);
    return this.prismaService.user.deleteMany({ where: { id } });
  }

  // Private method: Get user by ID
  private async getUserById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} does not exist`);
    }
    return user;
  }

  private async checkIfUserExist(name: string, id?: number): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: { name: name },
    });

    if (id) {
      return user ? user.id !== id : false;
    }

    return !!user;
  }
}
