import { Routes } from '@angular/router';
import { PromptFormComponent } from './prompt-form/prompt-form.component';

export const routes: Routes = [
    { path: '', component: PromptFormComponent },
    { path: '**', redirectTo: '' }
];
