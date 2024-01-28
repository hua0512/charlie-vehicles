import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerpointsFormComponent } from './chargerpoints-form.component';

describe('ChargerpointsFormComponent', () => {
  let component: ChargerpointsFormComponent;
  let fixture: ComponentFixture<ChargerpointsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerpointsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerpointsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
