import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HalachaSubmissionComponent } from './features/halacha/components/halacha-submission/halacha-submission.component';
import { HalachaViewComponent } from './features/halacha/pages/halacha-view/halacha-view.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HalachaSubmissionComponent },
            { path: 'halacha/:halachaNumber', component: HalachaViewComponent }
        ]
    },


    { path: '**', redirectTo: '' }
];
