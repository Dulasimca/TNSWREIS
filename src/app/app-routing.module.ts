import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './forms-module/registration/registration.component';
import { WardenDetailsComponent } from './forms-module/registration/warden-details/warden-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FoodmasterComponent } from './master/foodmaster/foodmaster.component';
import { HostelmasterComponent } from './master/hostelmaster/hostelmaster.component';
import { UsermasterComponent } from './master/usermaster/usermaster.component';


const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'foodmaster',component:FoodmasterComponent},
  { path: 'hostelmaster',component:HostelmasterComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'warden-detailsform', component: WardenDetailsComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'usermaster', component:UsermasterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
