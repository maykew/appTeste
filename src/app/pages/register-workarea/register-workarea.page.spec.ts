import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterWorkareaPage } from './register-workarea.page';

describe('RegisterWorkareaPage', () => {
  let component: RegisterWorkareaPage;
  let fixture: ComponentFixture<RegisterWorkareaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterWorkareaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
