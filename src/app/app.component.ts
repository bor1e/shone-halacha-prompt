import { Component } from '@angular/core';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [PromptFormComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Schone Halacha';
}
