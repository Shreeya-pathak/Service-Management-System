import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {

  constructor(readonly snack: MatSnackBar) {}

  show(message: string) {
    this.snack.open(message, 'OK', { duration: 3000 });
  }
}
