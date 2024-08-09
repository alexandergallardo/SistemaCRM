import { ActionReducerMap } from '@ngrx/store';
import { usuarioReducer } from './usuario.reducer';
import { User } from '../models/users.models';

export interface EstadoGlobal {
  usuarioActual: User | null;
}

export const reducersGlobales: ActionReducerMap<EstadoGlobal> = {
  usuarioActual: usuarioReducer,
};

export const obtenerUsuario = (estado: EstadoGlobal) => estado.usuarioActual;
