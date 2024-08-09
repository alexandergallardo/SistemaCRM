import { Action } from '@ngrx/store';
import { User } from '../models/users.models';

export const establecerUsuario = '[Usuario] EstablecerUsuario';
export const resetearUsuario = '[Usuario] ResetearUsuario';

export class AccionEstablecerUsuario implements Action {
  readonly type = establecerUsuario;
  constructor(public usuario: User) {}
}

export class AccionResetearUsuario implements Action {
  readonly type = resetearUsuario;
}

type UsuarioAcciones = AccionEstablecerUsuario | AccionResetearUsuario;

export function usuarioReducer(estado: User | null = null, action: Action): User | null {
  switch (action.type) {
    case establecerUsuario:
      return (action as AccionEstablecerUsuario).usuario;

    case resetearUsuario:
      return null;

    default:
      return estado;
  }
}
