import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './forms-module/registration/registration.component';
import { WardenDetailsComponent } from './forms-module/registration/warden-details/warden-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommodityMasterComponent } from './master/commodity-master/commodity-master.component';
import { FoodmasterComponent } from './master/foodmaster/foodmaster.component';
import { HostelmasterComponent } from './master/hostelmaster/hostelmaster.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { AuthGuard } from './services/auth.guard';



const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'foodmster',component:FoodmasterComponent},
  { path: 'hostelmaster',component:HostelmasterComponent},
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'warden-detailsform', component: WardenDetailsComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'commodity-master', component: CommodityMasterComponent},
  { path: 'opening-balance', component: OpeningBalanceComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
