import { Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';

export const routes: Routes = [
    { path: 'single-view', component: ViewComponent },
    { path: '', redirectTo: '/single-view', pathMatch: 'full'} //Default
];
