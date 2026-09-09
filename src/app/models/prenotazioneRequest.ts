export interface Prenotazione {
  sport: string;
  numeroGiocatori: number;
  costoTotale: number;
  costoPersona: number;
  statoPrenotazione: 'CONFERMATA' | 'NON_CONFERMATA';
  disponibilitaCampo: 'PRENOTATO' | 'LIBERO';
}
