import { Routes } from '@angular/router';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { DesignLibraryLayoutComponent } from './components/design-library/design-library-layout.component';
import { designLibraryGuard } from './components/design-library/design-library.guard';
import { TranslationListComponent } from './components/translation-list/translation-list.component';

export const routes: Routes = [
    { path: '', component: PromptFormComponent },
    { path: 'translations', component: TranslationListComponent },
    {
        path: 'design-library',
        component: DesignLibraryLayoutComponent,
        canActivate: [designLibraryGuard]
    },
    { path: '**', redirectTo: '' }
];
