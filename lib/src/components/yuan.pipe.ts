import { PipeTransform, Pipe } from '@angular/core';

/**
 * 分专为元，并加上人民币符号
 */
@Pipe({ name: 'yuan' })
export class YuanPipe implements PipeTransform {
  transform(value: number): string {
    return '¥ ' + ((value / 100) || 0).toFixed(2);
  }
}
