import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRechargeInfoComponent } from './user-recharge-info.component';

describe('UserRechargeInfoComponent', () => {
  let component: UserRechargeInfoComponent;
  let fixture: ComponentFixture<UserRechargeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRechargeInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRechargeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
