import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeComponent } from './fridge.component';

describe('FridgeComponent', () => {
  let component: FridgeComponent;
  let fixture: ComponentFixture<FridgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FridgeComponent]
    });
    fixture = TestBed.createComponent(FridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
