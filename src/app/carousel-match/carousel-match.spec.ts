import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselMatch } from './carousel-match';

describe('CarouselMatch', () => {
  let component: CarouselMatch;
  let fixture: ComponentFixture<CarouselMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselMatch],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
