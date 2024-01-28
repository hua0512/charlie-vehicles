import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerpointsListComponent } from './chargerpoints-list.component';

describe('ChargerpointsListComponent', () => {
  let component: ChargerpointsListComponent;
  let fixture: ComponentFixture<ChargerpointsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerpointsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerpointsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
