import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFilter } from './model-filter';

describe('ModelFilter', () => {
  let component: ModelFilter;
  let fixture: ComponentFixture<ModelFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
