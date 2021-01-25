import { HttpErrorResponse } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  spinnerActive = false;
  errorMessage: string;
  viewPassword1 = false;
  viewPassword2 = false;
  regInfo: any = {
    account: '123456789012'
  };
  bsModalErrorRef: BsModalRef;

  @ViewChild('errorTemplate', { read: TemplateRef }) errorTemplate: TemplateRef<any>;
  @ViewChild('successTemplate', { read: TemplateRef }) successTemplate: TemplateRef<any>;

  //**************************************************************************
  constructor(
    private accountService: AccountService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef) { }

  //**************************************************************************
  register(form: NgForm) {
    this.spinnerActive = true;
    this.accountService.register(form.value)
      .subscribe(() => {
        this.bsModalErrorRef = this.modalService.show(this.successTemplate, {
          backdrop: 'static',
          class: 'modal-dialog-centered'
        });
        // Successfull registration, close modal
        this.bsModalRef.hide();
      },
      error => {
        this.spinnerActive = false;
        this.resolveError(error);
        this.bsModalErrorRef = this.modalService.show(this.errorTemplate, {
          backdrop: 'static',
          class: 'modal-dialog-centered'
        });
      },
      () => this.spinnerActive = false);
  }

  //**************************************************************************
  resolveError(error: HttpErrorResponse): void {
    this.errorMessage = '';
    switch (error.status) {
      case 400: this.errorMessage = 'REGISTER-ERROR'; break;
      default: this.errorMessage = 'UNKNOWN-ERROR'; break;
    }
  }

  //**************************************************************************
  checkForMatchingPassword(): boolean {
    return this.regInfo.password && this.regInfo.confirmPassword && this.regInfo.password==this.regInfo.confirmPassword;
  }
}
