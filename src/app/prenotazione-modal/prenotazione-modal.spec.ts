import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotazioneModal } from './prenotazione-modal';

describe('PrenotazioneModal', () => {
  let component: PrenotazioneModal;
  let fixture: ComponentFixture<PrenotazioneModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenotazioneModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PrenotazioneModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
