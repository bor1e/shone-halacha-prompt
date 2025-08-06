import { Routes } from '@angular/router';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { DesignLibraryLayoutComponent } from './components/design-library/design-library-layout.component';

export const routes: Routes = [
    { path: '', component: PromptFormComponent },
    { path: 'design-library', component: DesignLibraryLayoutComponent },
    { path: '**', redirectTo: '' }
];
