import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRechargesListComponent } from './user-recharges-list.component';

describe('UserRechargesListComponent', () => {
  let component: UserRechargesListComponent;
  let fixture: ComponentFixture<UserRechargesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRechargesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRechargesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
