import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyInput } from './api-key-input';

describe('ApiKeyInput', () => {
  let component: ApiKeyInput;
  let fixture: ComponentFixture<ApiKeyInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiKeyInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiKeyInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
