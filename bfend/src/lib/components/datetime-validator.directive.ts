import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { datetimeValidator } from '../utils/form';

@Directive({
  selector: '[bfDatetime]',
  providers: [{provide: NG_VALIDATORS, useExisting: BfDatetimeValidatorDirective, multi: true}]
})
export class BfDatetimeValidatorDirective implements Validator {

  @Input() appConfirmation: string;

  validate(c: AbstractControl): ValidationErrors | null {
    return datetimeValidator()(c);
  }
}
