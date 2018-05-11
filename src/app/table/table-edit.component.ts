import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { touchForm } from 'bfend';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  template: `
    <form nz-form [formGroup]="form">
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="name">名称</nz-form-label>
        <nz-form-control [nzSm]="16" [nzXs]="24">
          <input nz-input formControlName="name" id="name">
          <nz-form-explain *ngIf="form.get('name').dirty && form.get('name').errors">请输入正确的名称</nz-form-explain>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class TableEditComponent implements OnInit {

  @Input() id: number;

  form: FormGroup;

  constructor(private fb: FormBuilder, private nzMessage: NzMessageService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]]
    });
  }

  submit() {
    return new Promise(resolve => {
      if (!this.form.valid) {
        touchForm(this.form);
        resolve(false);
        return;
      }

      setTimeout(() => {
        this.nzMessage.success(this.id ? '修改成功' : '添加成功');
        resolve();
      }, 1000);
    });
  }
}
