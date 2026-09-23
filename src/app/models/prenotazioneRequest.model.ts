// Corrisponde a it.dto.DisponibilitaCampoDto lato backend.
// NB: il campo "campo" è @JsonIgnore lato backend, quindi non arriva mai
// nella risposta: per il nome/prezzo del campo va usato CampoDto a parte.
export interface DisponibilitaCampoDto {
  id: number;
  statoDisponibilita: string;
  data: string; // LocalDateTime -> ISO string
  oraInizio: string;
  oraFine: string;
}

// Riferimento minimo alla disponibilità quando si invia una nuova
// prenotazione: al backend serve solo l'id per recuperare l'entità.
export interface DisponibilitaCampoRef {
  id: number;
}

// Corrisponde a it.dto.PrenotazioneDto lato backend.
// Usato sia per il body inviato in POST /prenotazione,
// sia per la risposta ricevuta dal backend.
export interface PrenotazioneDto {
  id?: number;
  dataPrenotazione?: string;
  numeroGiocatori: number;
  costoTotale?: number;
  quotaPersona?: number;
  statoPrenotazione?: string;
  disponibilitaCampo?: DisponibilitaCampoRef | DisponibilitaCampoDto;
}

// Corrisponde a it.dto.CampoDto lato backend.
export interface CampoDto {
  id: number;
  nome: string;
  tipologia: string;
  prezzo: number;
  coperto: boolean;
}
