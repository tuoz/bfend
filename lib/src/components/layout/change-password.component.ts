import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BfModalProxyComponent } from '../modal-proxy.component';
import { NzMessageService } from 'ng-zorro-antd';
import { MeApi } from '../../api/me.api';
import { confirmationValidator, touchForm } from '../../utils/form';
import { finalize } from 'rxjs/operators/finalize';
import { tap } from 'rxjs/operators/tap'

@Component({
  template: `
    <bf-modal-proxy [submitting]="submitting" (submit)="submit()">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="old_password">旧密码</nz-form-label>
          <nz-form-control [nzSm]="16" [nzXs]="24">
            <input nz-input type="password" formControlName="old_password" id="old_password">
            <nz-form-explain *ngIf="form.get('old_password').dirty && form.get('old_password').errors">请输入正确的密码</nz-form-explain>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="new_password">新密码</nz-form-label>
          <nz-form-control [nzSm]="16" [nzXs]="24">
            <input nz-input type="password" formControlName="new_password" id="new_password">
            <nz-form-explain *ngIf="form.get('new_password').dirty && form.get('new_password').errors">请输入正确的密码</nz-form-explain>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="new_password_confirmation">重复密码</nz-form-label>
          <nz-form-control [nzSm]="16" [nzXs]="24">
            <input nz-input type="password" formControlName="new_password_confirmation"
                   id="new_password_confirmation">
            <nz-form-explain
              *ngIf="form.get('new_password_confirmation').dirty && form.get('new_password_confirmation').hasError('required')">
              重复密码必须填写
            </nz-form-explain>
            <nz-form-explain
              *ngIf="form.get('new_password_confirmation').dirty && form.get('new_password_confirmation').hasError('confirmation')">
              两次密码不一致
            </nz-form-explain>
          </nz-form-control>
        </nz-form-item>
      </form>
    </bf-modal-proxy>
  `
})

export class BfChangePasswordComponent implements OnInit {
  form: FormGroup;
  submitting = false;

  @ViewChild(BfModalProxyComponent)
  private modal: BfModalProxyComponent;

  constructor(
    private fb: FormBuilder,
    private nzMessage: NzMessageService,
    private api: MeApi,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      'old_password': [null, Validators.required],
      'new_password': [null, [Validators.required, Validators.minLength(6)]],
      'new_password_confirmation': [null, [Validators.required, confirmationValidator('new_password')]]
    });
  }

  submit() {
    if (this.form.invalid) {
      touchForm(this.form);
      return;
    }

    const value = {...this.form.value} as any;

    this.api
      .changePassword(value.old_password, value.new_password)
      .pipe(
        tap(() => this.submitting = true),
        finalize(() => this.submitting = false)
      )
      .subscribe(
        res => {
          this.nzMessage.success('修改成功');
          this.modal.success();
        }
      );
  }
}
