import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { confirmationValidator, touchForm } from '../utils/form';

@Component({
  template: `
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
  `
})

export class BfChangePasswordComponent implements OnInit, OnDestroy {

  private sub = new Subscription();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      'old_password': [null, Validators.required],
      'new_password': [null, [Validators.required, Validators.minLength(6)]],
      'new_password_confirmation': [null, [Validators.required, confirmationValidator('new_password')]]
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getValue() {
    if (this.form.invalid) {
      touchForm(this.form);
      return;
    }

    return this.form.value;
  }
}
