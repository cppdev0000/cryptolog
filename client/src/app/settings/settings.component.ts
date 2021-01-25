import { NgForm } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Component } from '@angular/core';
import { IProfile } from '../interfaces/profile.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  spinnerActiveA = false;
  spinnerActiveS = false;
  profile: IProfile;

  //**************************************************************************
  constructor(private accountService: AccountService) {
    this.profile = Object.assign({}, accountService.getProfile());
   }

  //**************************************************************************
  saveProfile() {
    this.spinnerActiveA = true;
    this.accountService.saveProfile(this.profile)
      .subscribe(() => {
      },
      error => {
      },
      () => this.spinnerActiveA = false);
  }

  //**************************************************************************
  updatePassword(form: NgForm) {
    this.spinnerActiveS = true;
    this.accountService.updatePassword(form.value)
    .subscribe(() => {
    },
    error => {
    },
    () => this.spinnerActiveS = false);
  }
}
