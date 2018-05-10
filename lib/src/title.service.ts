import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * @dynamic
 *
 * 设置标题（用法见 AppComponent）
 * 标题获取的优先级为：route > html
 *  路由：配置标准的方法见 `./routes/routes.ts` 路由配置节点中 `data` 属性，允许设置：`title` 参数
 *  html：若不指定则从 `title__text` 中获取内容
 */
@Injectable()
export class TitleService {
  constructor(private title: Title, @Inject(DOCUMENT) private doc: Document) {}

  private _prefix = '';
  private _suffix = '';
  private _separator = ' - ';
  private _reverse = false;

  /** 设置分隔符 */
  set separator(value: string) {
    this._separator = value;
  }

  /** 设置前缀 */
  set prefix(value: string) {
    this._prefix = value;
  }

  /** 设置后缀 */
  set suffix(value: string) {
    this._suffix = value;
  }

  /** 设置是否反转 */
  set reverse(value: boolean) {
    this._reverse = value;
  }

  private getFromElement(): string {
    const el = this.doc.querySelector('.title__text');
    if (el) {
      return el.firstChild.textContent.trim();
    }
    return '';
  }

  /**
   * 设置标题
   * 若不指定则从 `content__title` 中获取 `h1` 内容
   */
  set(title?: string | string[]) {
    if (!title) {
      title = this.getFromElement();
    }
    if (title && !Array.isArray(title)) {
      title = [title];
    }

    let newTitles = [];
    if (this._prefix) {
      newTitles.push(this._prefix);
    }
    if (title && title.length > 0) {
      newTitles.push(...(title as string[]));
    }
    if (this._suffix) {
      newTitles.push(this._suffix);
    }
    if (this._reverse) {
      newTitles = newTitles.reverse();
    }

    this.title.setTitle(newTitles.join(this._separator));
  }

}
