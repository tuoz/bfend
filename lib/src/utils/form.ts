import { AbstractControl, FormArray, FormGroup, ValidatorFn } from '@angular/forms';

export function touchForm(form: FormGroup | FormArray | AbstractControl): void {
  if (form instanceof FormGroup) {
    for (const i of Object.keys(form.controls)) {
      touchForm(form.controls[i]);
    }
  } else if (form instanceof FormArray) {
    for (const c of form.controls) {
      touchForm(c);
    }
  } else {
    form.markAsDirty();
    form.updateValueAndValidity();
  }
}

export function confirmationValidator(field: string): ValidatorFn {
  return (c: AbstractControl) => {
    if (!c.parent) { return null; }
    return c.value === c.parent.get(field).value ? null : {confirmation: c.value};
  };
}

const datetimeRexp = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01]) (0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export function datetimeValidator(): ValidatorFn {
  return (c: AbstractControl) => {
    return !c.value || datetimeRexp.test(c.value.toString().trim()) && !isNaN(new Date(c.value.toString()).getTime()) ?
      null :
      {datetime: c.value};
  };
}

const phoneRexp = /1\d{10}/;

export function phoneValidator(): ValidatorFn {
  return (c: AbstractControl) => {
    return !c.value || phoneRexp.test(c.value.toString().trim()) ? null : {phone: c.value};
  };
}
