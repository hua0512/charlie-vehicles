import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVehiclesFormComponent } from './user-vehicles-form.component';

describe('UserVehiclesFormComponent', () => {
  let component: UserVehiclesFormComponent;
  let fixture: ComponentFixture<UserVehiclesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVehiclesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserVehiclesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
