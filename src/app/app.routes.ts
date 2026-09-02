import { Routes } from '@angular/router';
import { UserHome } from './user-home/user-home';
import { Home } from './home/home';

export const routes: Routes = [
 {
    path: '',
    component: Home
  },

  {
    path: 'user-home',
    component: UserHome
  }
   
];
