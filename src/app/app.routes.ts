import { Routes } from '@angular/router';
import { PromptFormComponent } from './prompt-form/prompt-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/de',
        pathMatch: 'full'
    },
    {
        path: ':lang',
        component: PromptFormComponent
    }
];
