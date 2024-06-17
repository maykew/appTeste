import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentifyFacesPage } from './identify-faces.page';

describe('IdentifyFacesPage', () => {
  let component: IdentifyFacesPage;
  let fixture: ComponentFixture<IdentifyFacesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyFacesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
