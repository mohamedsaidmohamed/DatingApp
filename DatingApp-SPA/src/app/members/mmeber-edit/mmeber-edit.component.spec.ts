/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MmeberEditComponent } from './mmeber-edit.component';

describe('MmeberEditComponent', () => {
  let component: MmeberEditComponent;
  let fixture: ComponentFixture<MmeberEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmeberEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmeberEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
