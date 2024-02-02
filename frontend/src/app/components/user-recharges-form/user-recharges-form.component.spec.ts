import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRechargesFormComponent } from './user-recharges-form.component';

describe('UserRechargesFormComponent', () => {
  let component: UserRechargesFormComponent;
  let fixture: ComponentFixture<UserRechargesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRechargesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRechargesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
