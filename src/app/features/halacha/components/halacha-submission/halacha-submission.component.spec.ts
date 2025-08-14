import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { HalachaSubmissionComponent } from './halacha-submission.component';
describe('HalachaSubmissionComponent', () => {
  let component: HalachaSubmissionComponent;
  let fixture: ComponentFixture<HalachaSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalachaSubmissionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HalachaSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
