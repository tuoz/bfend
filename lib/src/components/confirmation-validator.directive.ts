import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { confirmationValidator } from '../utils/form';

@Directive({
  selector: '[bfConfirm]',
  providers: [{provide: NG_VALIDATORS, useExisting: ConfirmationValidatorDirective, multi: true}]
})
export class ConfirmationValidatorDirective implements Validator {

  @Input() confirm: string;

  validate(c: AbstractControl): ValidationErrors | null {
    return confirmationValidator(this.confirm)(c);
  }
}
