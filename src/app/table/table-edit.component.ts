import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { touchForm } from 'bfend';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { tap, finalize } from 'rxjs/operators';

import { UserApi } from '../core/api/user.api';

@Component({
  template: `
    <nz-spin [nzSpinning]="loading">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="name">名称</nz-form-label>
          <nz-form-control [nzSm]="16" [nzXs]="24">
            <input nz-input formControlName="name" id="name">
            <nz-form-explain *ngIf="form.get('name').dirty && form.get('name').errors">请输入正确的名称</nz-form-explain>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-spin>
  `
})
export class TableEditComponent implements OnInit {
  @Input() id: number;
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Optional() private nzModalRef: NzModalRef,
    private nzMessage: NzMessageService,
    private api: UserApi
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]]
    });

    this.load();
  }

  load() {
    if (this.id) {
      this.api
        .profile(this.id)
        .pipe(tap(() => (this.loading = true)), finalize(() => (this.loading = false)))
        .subscribe(
          user => {
            this.form.setValue({
              name: user.name
            });
          },
          err => {
            if (this.nzModalRef) {
              this.nzModalRef.triggerCancel();
            }
            console.error(err);
          }
        );
    }
  }

  submit() {
    return new Promise(resolve => {
      if (!this.form.valid) {
        touchForm(this.form);
        resolve(false);
        return;
      }

      this.api
        .update(this.id, [])
        .pipe(tap(() => (this.loading = true)), finalize(() => (this.loading = false)))
        .subscribe(
          () => {
            this.nzMessage.success(this.id ? '修改成功' : '添加成功');
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }
}
