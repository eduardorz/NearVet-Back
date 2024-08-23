import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/createUser.dto';

export class LoginUserDto extends PickType (CreateUserDto, ["email", "password"]) {}