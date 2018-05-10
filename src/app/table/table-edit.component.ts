import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalComponent } from 'ng-zorro-antd';

@Component({
  template: `
    <p>Table Edit</p>
  `
})
export class TableEditComponent implements OnInit {
  @Input() id: number;

  private modal: NzModalComponent;

  constructor(private modalRef: NzModalRef) {}

  ngOnInit() {
    console.log('id:', this.id);
    this.modal = this.modalRef.getInstance();
    (this.modal.nzOnOk as EventEmitter<any>).subscribe(this.submit.bind(this));
  }

  submit() {
    this.modal.nzOkLoading = true;
    if (this.id++ < 125) {
      this.modal.nzOkLoading = false;
    } else {
      setTimeout(() => {
        this.modal.destroy();
      }, 1000);
    }
  }
}
