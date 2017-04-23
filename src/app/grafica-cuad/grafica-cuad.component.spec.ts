import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaCuadComponent } from './grafica-cuad.component';

describe('GraficaCuadComponent', () => {
  let component: GraficaCuadComponent;
  let fixture: ComponentFixture<GraficaCuadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficaCuadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaCuadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
