const LEAD_ETAPAS: Record<string, string> = {
  NUEVO: 'Nuevo',
  CONTACTADO: 'Contactado',
  TRABAJANDO: 'Trabajando',
  CALIFICADO: 'Calificado',
  NO_CALIFICADO: 'No Calificado',
};

export const LEAD_ETAPAS_KEYS = Object.keys(LEAD_ETAPAS);

export function obtenerEtapa(index: string): string {
  return LEAD_ETAPAS[index];
}