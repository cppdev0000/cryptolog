import { Controller, Request, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { User } from './users/user';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { UserDto } from './users/dto/user.dto';

@Controller('api/users')
export class UserController {

  //**************************************************************************
  constructor(
    private readonly authService: AuthService
    ) {}

  //**************************************************************************
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
  
  //**************************************************************************
  @Post('create')
  create(@Body() userDto: UserDto): Promise<User> {
    return this.authService.create(userDto.email, userDto.password);
  }
}
