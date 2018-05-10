import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalRef, NzModalComponent } from 'ng-zorro-antd';

@Component({
  selector: 'bf-modal-proxy',
  template: `
  <nz-spin [nzSpinning]="loading">
    <ng-content></ng-content>
  </nz-spin>
  `,
})
export class BfModalProxyComponent implements OnInit, OnChanges {

  private modal: NzModalComponent;

  @Input() loading = false;
  @Input() submitting = false;

  @Output() submit = new EventEmitter();

  constructor(
    private modalRef: NzModalRef
  ) {}

  ngOnInit() {
    this.modal = this.modalRef.getInstance();
    (this.modal.nzOnOk as EventEmitter<any>).subscribe(() => this.submit.emit());
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('submitting' in changes && this.modal) {
      const c = changes['submitting'];
      this.modal.nzOkLoading = c.currentValue;
    }
  }

  success(data = 'ok') {
    this.modalRef.destroy(data);
  }

  close() {
    this.modalRef.destroy();
  }
}
