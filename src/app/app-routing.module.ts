import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderComponent } from './forms-module/purchase-order/purchase-order.component';
import { RegistrationComponent } from './forms-module/registration/registration.component';
import { WardenDetailsComponent } from './forms-module/warden-details/warden-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommodityMasterComponent } from './master/commodity-master/commodity-master.component';
import { FoodmasterComponent } from './master/foodmaster/foodmaster.component';
import { HostelmasterComponent } from './master/hostelmaster/hostelmaster.component';
import { UsermasterComponent } from './master/usermaster/usermaster.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { AuthGuard } from './services/auth.guard';
import { HostelImageComponent } from './master/hostel-image/hostel-image.component';
import { DistrictComponent } from './master/district/district.component';
import { TalukComponent } from './master/taluk/taluk.component';
import { ChangePasswordComponent } from './master/change-password/change-password.component';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'foodmaster',component:FoodmasterComponent},
  { path: 'hostelmaster',component:HostelmasterComponent, canActivate: [AuthGuard]},
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'warden-detailsform', component: WardenDetailsComponent, canActivate: [AuthGuard]}, 
  { path: 'opening-balance', component: OpeningBalanceComponent, canActivate: [AuthGuard]},
  { path: 'commodity-master', component: CommodityMasterComponent, canActivate: [AuthGuard]},

  { path: 'usermaster', component:UsermasterComponent},
  { path: 'hostel-image',component:HostelImageComponent, canActivate: [AuthGuard]},

  { path: 'usermaster', component:UsermasterComponent, canActivate: [AuthGuard]},
  { path: 'purchase-order', component:PurchaseOrderComponent, canActivate: [AuthGuard]},
  { path:  'district', component:DistrictComponent},
  { path: 'taluk', component:TalukComponent},
  { path: 'changepassword', component:ChangePasswordComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
