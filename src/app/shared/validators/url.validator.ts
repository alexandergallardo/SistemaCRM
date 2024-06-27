import { AbstractControl } from "@angular/forms";

export function ValidadorUrl(control: AbstractControl): { [key: string]: string } | null {
  const url: string = control.value;

  if (!url) {
    return null;
  }

  if (url.startsWith('https://')) {
    return null;
  }

  return { error: 'La URL debe comenzar con "https://"' };
}