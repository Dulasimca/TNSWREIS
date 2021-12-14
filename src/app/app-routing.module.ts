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
import { ChangePasswordComponent } from './master/change-password/change-password.component';
import { ConsumptionComponent } from './forms-module/consumption/consumption.component';
import { IdCardInfoComponent } from './id-card-info/id-card-info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendanceReportComponent } from './Reports/attendance-report/attendance-report.component';
import { WardenReportComponent } from './Reports/warden-report/warden-report.component';
import { AttendanceImageComponent } from './forms-module/Attendance-image/Attendance-image.component';
import { DailyconsumptionReportComponent } from './Reports/dailyconsumption-report/dailyconsumption-report.component';
import { PurchaseorderReportComponent } from './Reports/purchaseorder-report/purchaseorder-report.component';
import { StudentDetailsComponent } from './Reports/student-details/student-details.component';
import { HostelReportComponent } from './Reports/hostel-report/hostel-report.component';
import { OpeningbalanceReportComponent } from './Reports/openingbalance-report/openingbalance-report.component';
import { PurchaseUploadComponent } from './forms-module/purchase-upload/purchase-upload.component';
import { FeedingchargestypeComponent } from './master/feedingchargestype/feedingchargestype.component';
import { HostelinfrastructureComponent } from './master/hostelinfrastructure/hostelinfrastructure.component';
import { MonthlywiseintentComponent } from './forms-module/monthlywiseintent/monthlywiseintent.component';
import { DOFundManagementComponent } from './Fund-Management-Module/do-fund-management/do-fund-management.component';
import { HOFundmanagementComponent } from './Fund-Management-Module/ho-fundmanagement/ho-fundmanagement.component';
import { TOFundManagementComponent } from './Fund-Management-Module/to-fund-management/to-fund-management.component';
import { HostelFundManagementComponent } from './Fund-Management-Module/hostel-fund-management/hostel-fund-management.component';

import { AuditComponent } from './forms-module/audit/audit.component';
import { StudentfacilityMasterComponent } from './master/studentfacility-master/studentfacility-master.component';
import { StudentfacilityReportComponent } from './Reports/studentfacility-report/studentfacility-report.component';
import { ApprovalRequestComponent } from './forms-module/approval-request/approval-request.component';
import { ApprovalComponent } from './forms-module/approval/approval.component';
import { StudentTransferFormComponent } from './forms-module/student-transfer-form/student-transfer-form.component';
import { FundmanagementReportComponent } from './Reports/fundmanagement-report/fundmanagement-report.component';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'foodmaster',component:FoodmasterComponent, canActivate: [AuthGuard]},
  { path: 'hostelmaster',component:HostelmasterComponent, canActivate: [AuthGuard]},
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'warden-details', component: WardenDetailsComponent, canActivate: [AuthGuard]}, 
  { path: 'opening-balance', component: StudentTransferFormComponent, canActivate: [AuthGuard]},
  { path: 'student-transfer', component: StudentTransferFormComponent, canActivate: [AuthGuard]},
  { path: 'commodity-master', component: CommodityMasterComponent, canActivate: [AuthGuard]},
  { path: 'user-master', component:UsermasterComponent, canActivate: [AuthGuard]},
  { path: 'idcard-info', component:IdCardInfoComponent, canActivate: [AuthGuard]},
  { path: 'warden-report', component:WardenReportComponent, canActivate: [AuthGuard]},
  { path: 'dailyconsumption-report', component:DailyconsumptionReportComponent, canActivate: [AuthGuard]},
  { path: 'purchaseorder-report', component:PurchaseorderReportComponent, canActivate: [AuthGuard]},
  { path: 'student-report', component:StudentDetailsComponent, canActivate: [AuthGuard]},
  { path: 'openingblnc-report', component:OpeningbalanceReportComponent, canActivate: [AuthGuard]},

  { path: 'hostelgo', component:HostelGoComponent, canActivate: [AuthGuard]},

  { path: 'hostel-image',component:HostelImageComponent, canActivate: [AuthGuard]},

  { path: 'purchase-order', component:PurchaseOrderComponent, canActivate: [AuthGuard]},
  { path: 'purchase-bill-upload', component:PurchaseUploadComponent, canActivate: [AuthGuard]},
  { path: 'daily-consumption', component:ConsumptionComponent, canActivate: [AuthGuard]},
  { path: 'district', component:DistrictComponent, canActivate: [AuthGuard]},
  { path: 'taluk', component:TalukComponent, canActivate: [AuthGuard]},
  { path: 'attendance', component:AuditComponent, canActivate: [AuthGuard]},
  { path: 'changepassword', component:ChangePasswordComponent, canActivate: [AuthGuard]},


  { path: 'attendancereport', component:AttendanceReportComponent, canActivate: [AuthGuard]},
  { path: 'attendance-image', component:AttendanceImageComponent, canActivate: [AuthGuard]},

  { path: 'hostelreport', component:HostelReportComponent, canActivate: [AuthGuard]},
  { path: 'feedingchargestype', component:FeedingchargestypeComponent, canActivate: [AuthGuard]},
  { path: 'hostelinfrastructure', component:HostelinfrastructureComponent,}, 
  { path: 'monthlywiseintent', component:MonthlywiseintentComponent,},
  { path: 'taluk', component:DOFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'ho-fundmanagement', component:HOFundmanagementComponent, canActivate: [AuthGuard]}, 
  { path: 'do-fundmanagement', component:DOFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'to-fundmanagement', component:TOFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'hostel-fundmanagement', component:HostelFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'fund-report', component:FundmanagementReportComponent, canActivate: [AuthGuard]},
  
  { path: 'studentfacility', component:StudentfacilityMasterComponent},
  { path: 'studentfacilityreport', component:StudentfacilityReportComponent},
  { path: 'approvalrequest', component:ApprovalRequestComponent},
  { path: 'approval', component:ApprovalComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
