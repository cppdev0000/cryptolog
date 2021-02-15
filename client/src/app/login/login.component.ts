import { RegisterComponent } from '../modals/register/register.component';
import { AccountService } from './../services/account.service';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string;
  spinnerActive = false;
  creds = {
    email: 'user@example.com',
    password: 'String-1'
  }
  bsModalRef: BsModalRef;

  @ViewChild('errorTemplate', { read: TemplateRef }) errorTemplate: TemplateRef<any>;

  //**************************************************************************
  constructor(
    private accountService: AccountService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/main']);
    }
  }

  //**************************************************************************
  login(form: NgForm) {
    this.spinnerActive = true;
    this.accountService.login(form.value.email, form.value.password)
      .subscribe(data => {
        sessionStorage.setItem('token', data.token);
        this.router.navigate(['/main']);
      },
      error => {
        console.log(error);
        this.resolveError(error);
        this.bsModalRef = this.modalService.show(this.errorTemplate, {
          backdrop: 'static',
          class: 'modal-dialog-centered'
        });
        this.spinnerActive = false;
      },
      () => this.spinnerActive = false);
  }

  //**************************************************************************
  resolveError(error: HttpErrorResponse): void {
    this.errorMessage = '';
    switch (error.status) {
      case 400: this.errorMessage = 'BAD-CREDENTIALS'; break;
      default: this.errorMessage = 'UNKNOWN-ERROR'; break;
    }
  }

  //**************************************************************************
  register(): void {
    this.bsModalRef = this.modalService.show(RegisterComponent, {
      backdrop: 'static',
      class: 'modal-dialog-centered'
    });
  }
}
