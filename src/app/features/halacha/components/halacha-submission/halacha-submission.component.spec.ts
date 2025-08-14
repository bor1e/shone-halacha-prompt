import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PromptFormComponent } from './prompt-form.component';

describe('PromptFormComponent', () => {
  let component: PromptFormComponent;
  let fixture: ComponentFixture<PromptFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PromptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
