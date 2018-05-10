import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/combineLatest';

import { AppService } from 'bfend';
import { AuthService } from 'bfend';

@Component({
  templateUrl: './login.component.html',
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
    private appService: AppService,
    private authService: AuthService,
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
