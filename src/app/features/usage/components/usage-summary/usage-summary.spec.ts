import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageSummary } from './usage-summary';

describe('UsageSummary', () => {
  let component: UsageSummary;
  let fixture: ComponentFixture<UsageSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
