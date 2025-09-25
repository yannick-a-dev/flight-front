import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAlertDialogComponent } from './simple-alert-dialog.component';

describe('SimpleAlertDialogComponent', () => {
  let component: SimpleAlertDialogComponent;
  let fixture: ComponentFixture<SimpleAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleAlertDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
