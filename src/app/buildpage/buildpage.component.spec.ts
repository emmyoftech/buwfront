import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildpageComponent } from './buildpage.component';

describe('BuildpageComponent', () => {
  let component: BuildpageComponent;
  let fixture: ComponentFixture<BuildpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
