import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVehiclesListComponent } from './user-vehicles-list.component';

describe('UserVehiclesComponent', () => {
  let component: UserVehiclesListComponent;
  let fixture: ComponentFixture<UserVehiclesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVehiclesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVehiclesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
