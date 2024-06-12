import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvenComponent } from './oven.component';

describe('OvenComponent', () => {
  let component: OvenComponent;
  let fixture: ComponentFixture<OvenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OvenComponent]
    });
    fixture = TestBed.createComponent(OvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
