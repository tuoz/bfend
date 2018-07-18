import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * @dynamic
 */
@Injectable({
  providedIn: 'root'
})
export class BfTitleService {

  constructor(private title: Title, @Inject(DOCUMENT) private doc: Document) {}

  private _prefix = '';
  private _suffix = '';
  private _separator = ' - ';
  private _reverse = false;

  set separator(value: string) {
    this._separator = value;
  }

  set prefix(value: string) {
    this._prefix = value;
  }

  set suffix(value: string) {
    this._suffix = value;
  }

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
