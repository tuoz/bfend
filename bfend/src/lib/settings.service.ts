import { Inject, Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { BFEND_OPTIONS, BfendOptions } from './options.type';

export interface App {
  name?: string;
  title?: string;
  description?: string;
  year?: number;

  [key: string]: any;
}

export interface Layout {
  aside_width: number;
  // 是否折叠边栏
  collapsed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BfSettingsService {

  constructor(
    private storage: LocalStorageService,
    @Inject(BFEND_OPTIONS) private options: BfendOptions
  ) {}

  /**
   * App 基础信息
   */
  private _app: App = {
    year: new Date().getFullYear()
  };

  /**
   * 布局设置
   */
  private _layout: Layout = null;

  get app(): App {
    return this._app;
  }

  setApp(app: Partial<App>) {
    this._app = {...this._app, ...app};
  }

  get layout(): Layout {
    if (this._layout == null) {
      let layout = null;

      try {
        layout = this.storage.get(`${this.options.app_key}-layout`);
      } catch (err) {}

      if (layout == null) {
        this.resetLayout();
      } else {
        this._layout = layout;
      }
    }

    return this._layout;
  }

  setLayout(layout: Partial<Layout>) {
    this._layout = {...this._layout, ...layout};
    try {
      this.storage.set(`${this.options.app_key}-layout`, this._layout);
    } catch (err) {}
  }

  /**
   * Reset layout
   */
  resetLayout() {
    this.setLayout({
      aside_width: 200,
      collapsed: false
    });
  }

  toggleCollapsed() {
    this.setLayout({
      'collapsed': !this.layout.collapsed
    });
  }
}
