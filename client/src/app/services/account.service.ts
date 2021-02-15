import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { IProfile } from '../interfaces/profile.interface';
import { HttpClient } from '@angular/common/http';
import { ILoginResult } from '../interfaces/login-response.interface';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  profile: IProfile = {
    email: 'demo@demo.com',
    firstName: 'John',
    lastName: 'Smith',
    street1: '123 Main St',
    city: 'Anywhere',
    state: 'NY',
    zip: '10020'
  }

  //**************************************************************************
  constructor(private http: HttpClient) {
  }

  //**************************************************************************
  getProfile(): IProfile {
    return this.profile;
  }

  //**************************************************************************
  login(email: string, password: string): Observable<ILoginResult> {
    return this.http.post<ILoginResult>(`${environment.ACCOUNT_URL}/api/account/login`, {
      email,
      password
    });
  }

  //**************************************************************************
  register(regData: any): Observable<any> {
    return this.http.post(`${environment.ACCOUNT_URL}/api/account/register`, regData);
  }

  //**************************************************************************
  saveProfile(address: IProfile): Observable<any> {
    return of().pipe(delay(1000));
  }

  //**************************************************************************
  updatePassword(data: any): Observable<any> {
    return of().pipe(delay(1000));
  }
}
