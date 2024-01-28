import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatusComponentComponent } from './user-status-component.component';

describe('UserStatusComponentComponent', () => {
  let component: UserStatusComponentComponent;
  let fixture: ComponentFixture<UserStatusComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStatusComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserStatusComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
