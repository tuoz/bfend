import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';

import { BfAppService, BfSettingsService } from 'bfend';
import { BfAuthService } from 'bfend';

@Component({
  template: `
    <div class="container">
      <div class="login">
        <div class="logo"><img src="../../assets/img/logo-login.svg" alt="Logo"></div>
        <p class="title">{{settings.app.name}}</p>
        <form nz-form [formGroup]="form" (ngSubmit)="submit()" role="form">
          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzSize="large" nzPrefixIcon="anticon anticon-user">
                <input type="text" autofocus nz-input formControlName="username" placeholder="用户名">
              </nz-input-group>
              <nz-form-explain nz-form-explain *ngIf="form.get('username').dirty&&form.get('username').hasError('required')">用户名必填
              </nz-form-explain>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="anticon anticon-lock" nzSize="large">
                <input type="password" nz-input formControlName="password" placeholder="密码">
              </nz-input-group>
              <nz-form-explain *ngIf="form.get('password').dirty&&form.get('password').hasError('required')">密码必填</nz-form-explain>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-col [nzSpan]="12">
              <label nz-checkbox formControlName="remember">自动登录</label>
            </nz-col>
          </nz-form-item>
          <nz-form-item>
            <button nz-button style="width:100%;" type="submit" nzType="primary" nzSize="large" [nzLoading]="submitting">登录</button>
          </nz-form-item>
        </form>
      </div>
      <bf-footer [padding]="true"></bf-footer>
    </div>
  `,
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private subs: Subscription;

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private nzMessage: NzMessageService,
    public app: BfAppService,
    public settings: BfSettingsService,
    private authService: BfAuthService,
  ) {
    this.form = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      remember: [true]
    });

    this.subs = new Subscription();
  }

  ngOnInit() {
    this.subs.add(
      this.authService.valid$.subscribe(url => {
        this.router.navigate(['/dashboard'], {replaceUrl: true});
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  submit() {
    if (this.form.invalid) {
      for (const i of Object.keys(this.form.controls)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
      return;
    }

    const data = this.form.value;

    this.submitting = true;
    this.authService
      .login(data.username, data.password, data.remember)
      .subscribe(user => this.nzMessage.success('登录成功'), () => (this.submitting = false));
  }
}
