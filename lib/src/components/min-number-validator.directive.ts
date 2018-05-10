import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';

@Directive({
  selector: '[bfMinNumber]',
  providers: [{provide: NG_VALIDATORS, useExisting: BfMinNumberValidatorDirective, multi: true}]
})
export class BfMinNumberValidatorDirective implements Validator {

  @Input() minNumber: number;

  validate(c: AbstractControl): ValidationErrors | null {
    return Validators.min(this.minNumber)(c);
  }
}
