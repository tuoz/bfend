import { Directive, Input, ElementRef, Renderer2, OnDestroy, OnInit, AfterViewInit  } from '@angular/core';
import { Subscription } from 'rxjs';

import { BfACLService, ACLType } from '../auth/acl.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[acl]'
})
export class BfACLDirective implements OnDestroy, OnInit, AfterViewInit {
  private value: string | string[] | ACLType;
  private sub: Subscription;

  @Input()
  set acl(value: string | string[] | ACLType) {
    this.value = value;
  }

  private judge() {
    const CLS = 'acl__hide';
    const el = this.el.nativeElement;

    // TODO: 这个不屌，要该称 *ngIf 那种
    if (this.srv.can(this.value)) {
      this.renderer.removeClass(el, CLS);
    } else {
      this.renderer.addClass(el, CLS);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private srv: BfACLService) {}

  ngAfterViewInit() {
    this.judge();
  }

  ngOnInit() {
    this.sub = this.srv.rules$.subscribe(() => this.judge());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
