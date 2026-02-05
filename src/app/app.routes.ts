import { Routes } from '@angular/router';
import { Discovery } from './features/discovery';
import { Usage } from './features/usage';

export const routes: Routes = [
  { path: '', component: Discovery },
  { path: 'usage', component: Usage },
  { path: '**', redirectTo: '' }
];
