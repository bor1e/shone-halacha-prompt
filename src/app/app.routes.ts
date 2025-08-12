import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { HalachaViewComponent } from './components/halacha-view/halacha-view.component';
import { DesignLibraryLayoutComponent } from './components/design-library/design-library-layout.component';
import { designLibraryGuard } from './components/design-library/design-library.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: PromptFormComponent },
            { path: 'halacha/:halachaNumber', component: HalachaViewComponent }
        ]
    },
    {
        path: 'design-library',
        component: DesignLibraryLayoutComponent,
        canActivate: [designLibraryGuard]
    },
    { path: '**', redirectTo: '' }
];
