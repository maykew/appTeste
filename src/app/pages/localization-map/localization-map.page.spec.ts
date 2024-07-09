import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizationMapPage } from './localization-map.page';

describe('LocalizationMapPage', () => {
  let component: LocalizationMapPage;
  let fixture: ComponentFixture<LocalizationMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizationMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
