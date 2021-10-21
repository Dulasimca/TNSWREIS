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
import { OpeningBalanceComponent } from './forms-module/opening-balance/opening-balance.component';
import { AuthGuard } from './services/auth.guard';
import { HostelImageComponent } from './master/hostel-image/hostel-image.component';

import { HostelGoComponent } from './master/hostel-go/hostel-go.component';
import { DistrictComponent } from './master/district/district.component';
import { TalukComponent } from './master/taluk/taluk.component';
import { AttendanceComponent } from './forms-module/attendance/attendance.component';
import { ChangePasswordComponent } from './master/change-password/change-password.component';
import { ConsumptionComponent } from './forms-module/consumption/consumption.component';
import { IdCardInfoComponent } from './id-card-info/id-card-info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendanceReportComponent } from './Reports/attendance-report/attendance-report.component';
import { WardenReportComponent } from './Reports/warden-report/warden-report.component';
import { AttendanceImageComponent } from './forms-module/Attendance-image/Attendance-image.component';
import { DailyconsumptionReportComponent } from './Reports/dailyconsumption-report/dailyconsumption-report.component';
import { PurchaseorderReportComponent } from './Reports/purchaseorder-report/purchaseorder-report.component';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'foodmaster',component:FoodmasterComponent},
  { path: 'hostelmaster',component:HostelmasterComponent, canActivate: [AuthGuard]},
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'warden-details', component: WardenDetailsComponent, canActivate: [AuthGuard]}, 
  { path: 'opening-balance', component: OpeningBalanceComponent, canActivate: [AuthGuard]},
  { path: 'commodity-master', component: CommodityMasterComponent, canActivate: [AuthGuard]},
  { path: 'user-master', component:UsermasterComponent, canActivate: [AuthGuard]},
  { path: 'idcard-info', component:IdCardInfoComponent, canActivate: [AuthGuard]},
  { path: 'warden-report', component:WardenReportComponent, canActivate: [AuthGuard]},
  { path: 'dailyconsumption-report', component:DailyconsumptionReportComponent, canActivate: [AuthGuard]},
  { path: 'purchaseorder-report', component:PurchaseorderReportComponent, canActivate: [AuthGuard]},


  { path: 'hostelgo', component:HostelGoComponent, canActivate: [AuthGuard]},

  { path: 'hostel-image',component:HostelImageComponent, canActivate: [AuthGuard]},

  { path: 'purchase-order', component:PurchaseOrderComponent, canActivate: [AuthGuard]},
  { path: 'daily-consumption', component:ConsumptionComponent, canActivate: [AuthGuard]},
  { path: 'district', component:DistrictComponent},
  { path: 'taluk', component:TalukComponent},
  { path: 'attendance', component:AttendanceComponent},
  { path: 'changepassword', component:ChangePasswordComponent},
  {path:'attendancereport', component:AttendanceReportComponent},
  { path: 'attendance-image', component:AttendanceImageComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
