import { UserModel } from '../users/user.model';
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  //**************************************************************************
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  //**************************************************************************
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) { // User does not exist
      return null;
    }
    
    if (await this.validatePassword(password, user.passwordHash)) { // Does password match
      return user;
    }

    return null;
  }

  //**************************************************************************
  async login(user: UserModel) {
    const payload = {
      email: user.email,
      sub: user.id
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  //**************************************************************************
  async create(email: string, password: string): Promise<any> {
    const user = new UserModel();
    user.email = email;
    user.passwordHash = await this.hashPassword(password);

    //return user.save();
  }

  //**************************************************************************
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return (await bcrypt.hash(password, salt)) + '|' + salt;

    // $2b$10$5VbHYzJjZT11Y79vGqbdcer08lpnNi9Cr2wsxx77YU23VY7Co.aAW|$2b$10$5VbHYzJjZT11Y79vGqbdce
  }

  //**************************************************************************
  async validatePassword(password: string, passwordHash: string): Promise<boolean> {
    const saltIndex = passwordHash.indexOf('|');
    if (saltIndex == 0) return false;

    const pw = passwordHash.substr(0, saltIndex);
    const salt = passwordHash.substring(saltIndex + 1);

    return (await bcrypt.hash(password, salt)) === pw;
  }
}
