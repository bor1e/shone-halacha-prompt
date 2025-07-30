import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Nl2brPipe } from '../nl2br.pipe';

@Component({
  selector: 'app-prompt-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    Nl2brPipe
  ],
  templateUrl: './prompt-form.component.html',
  styleUrls: ['./prompt-form.component.scss']
})
export class PromptFormComponent {
  private api = inject(ApiService);

  hebrewText = signal('');
  halachaNumber = signal('');
  isLoading = signal(false);
  summary = signal('');
  error = signal('');

  updateHebrewText(value: string) {
    this.hebrewText.set(value);
  }

  updateHalachaNumber(value: string) {
    this.halachaNumber.set(value);
  }

  submit() {
    if (!this.hebrewText() || !this.halachaNumber()) {
      this.error.set('Bitte füllen Sie alle Felder aus.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');
    this.summary.set('');

    this.api.getHalachaSummary({
      hebrewText: this.hebrewText(),
      halachaNumber: this.halachaNumber()
    }).subscribe({
      next: (response) => {
        this.summary.set(response.summary);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Fehler beim Erstellen der Zusammenfassung. Bitte versuchen Sie es erneut.');
        this.isLoading.set(false);
        console.error('API Error:', err);
      }
    });
  }
}
