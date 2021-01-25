import { ITransaction } from './../../interfaces/transaction.interface';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-edit-transaction',
  templateUrl: './add-edit-transaction.component.html',
  styleUrls: ['./add-edit-transaction.component.css']
})
export class AddEditTransactionComponent implements OnInit {
  title: string;
  spinnerActive = false;
  errorMessage: string;
  bsModalErrorRef: BsModalRef;
  transaction: ITransaction;

  constructor(
    private modalService: BsModalService,
    public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  //**************************************************************************
  commit(form: NgForm) {
    /*this.spinnerActive = true;
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
      () => this.spinnerActive = false);*/
  }
}
