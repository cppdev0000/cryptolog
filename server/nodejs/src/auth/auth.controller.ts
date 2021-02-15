import { Controller, Request, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserModel } from 'src/users/user.model';
import { UserResource } from 'src/users/user.resource';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {

  //**************************************************************************
  constructor(private readonly authService: AuthService) {}

  //**************************************************************************
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
  
  //**************************************************************************
  @Post('create')
  create(@Body() userResource: UserResource): Promise<UserModel> {
    return this.authService.create(userResource.email, userResource.password);
  }
}
