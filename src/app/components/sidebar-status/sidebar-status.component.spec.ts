import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStatusComponent } from './sidebar-status.component';

describe('SidebarStatusComponent', () => {
  let component: SidebarStatusComponent;
  let fixture: ComponentFixture<SidebarStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
