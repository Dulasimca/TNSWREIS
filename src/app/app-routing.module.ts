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
import { DOFundManagementComponent } from './Fund-Management-Module/do-fund-management/do-fund-management.component';
import { HOFundmanagementComponent } from './Fund-Management-Module/ho-fundmanagement/ho-fundmanagement.component';
import { TOFundManagementComponent } from './Fund-Management-Module/to-fund-management/to-fund-management.component';
import { HostelFundManagementComponent } from './Fund-Management-Module/hostel-fund-management/hostel-fund-management.component';
import { FundmanagementReportComponent } from './Reports/fundmanagement-report/fundmanagement-report.component';

import { AuditComponent } from './forms-module/audit/audit.component';
import { StudentfacilityMasterComponent } from './master/studentfacility-master/studentfacility-master.component';
import { StudentfacilityReportComponent } from './Reports/studentfacility-report/studentfacility-report.component';
import { ApprovalRequestComponent } from './forms-module/approval-request/approval-request.component';
import { ApprovalComponent } from './forms-module/approval/approval.component';
import { MonthlywiseintentapprovalComponent } from './forms-module/monthlywiseintentapproval/monthlywiseintentapproval.component';
import { HostelinfrastructureReportComponent } from './Reports/hostelinfrastructure-report/hostelinfrastructure-report.component';
import { MonthlywiseintentReportComponent } from './Reports/monthlywiseintent-report/monthlywiseintent-report.component';
import { FeedingchargestypeReportComponent } from './Reports/feedingchargestype-report/feedingchargestype-report.component';

import { EmployeeMasterComponent } from './master/employee-master/employee-master.component';
import { EmployeeReportComponent } from './Reports/employee-report/employee-report.component';
import { StudentTransferFormComponent } from './forms-module/student-transfer-form/student-transfer-form.component';
import { EmployeeattendanceDetailsComponent } from './forms-module/employeeattendance-details/employeeattendance-details.component';
import { StudentAttendanceComponent } from './forms-module/student-attendance/student-attendance.component';
import { EmployeeattendanceReportComponent } from './Reports/employeeattendance-report/employeeattendance-report.component';
import { MonthlywiseintentComponent } from './forms-module/monthlywiseintent/monthlywiseintent.component';
import { BiometricDevicemappingComponent } from './Biometric/biometric-devicemapping/biometric-devicemapping.component';
import { FoodEntitlementComponent } from './master/food-entitlement/food-entitlement.component';
import { BiometricattendanceComponent } from './Biometric/biometricattendance/biometricattendance.component';
import { FoodentitlementReportComponent } from './Reports/foodentitlement-report/foodentitlement-report.component';
import { BiometricAttendanceComponent } from './Biometric/biometric-attendance/biometric-attendance.component';
import { BiometricattendancecountComponent } from './Biometric/biometricattendancecount/biometricattendancecount.component';
import { PurchasedetailsReportComponent } from './Reports/purchasedetails-report/purchasedetails-report.component';
import { DevicemappingReportComponent } from './Reports/devicemapping-report/devicemapping-report.component';
import { FeedbackComponent } from './Student/feedback/feedback.component';
import { StudentFeedbackComponent } from './Student/student-feedback/student-feedback.component';
import { StudentFeedbackRegistrationComponent } from './Student/student-feedback-registration/student-feedback-registration.component';
import { HostelgalleryuploadComponent } from './forms-module/hostelgalleryupload/hostelgalleryupload.component';
import { HomepageImageUploadComponent } from './forms-module/homepage-image-upload/homepage-image-upload.component';
import { HostelGalleryComponent } from './hostel-gallery/hostel-gallery.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { EmployeeStrengthComponent } from './forms-module/employee-strength/employee-strength.component';
import { StudentcountReportComponent } from './Reports/studentcount-report/studentcount-report.component';
import { HostelCommitteeComponent } from './master/hostel-committee/hostel-committee.component';
import { OnlineRegistrationComponent } from './forms-module/online-registration/online-registration.component';
import { DistrictWiseDashboardComponent } from './Dashboards/district-wise-dashboard/district-wise-dashboard.component';
import { OnlineRegistrationCheckComponent } from './forms-module/online-registration-check/online-registration-check.component';
import { TalukWiseDashboardComponent } from './Dashboards/taluk-wise-dashboard/taluk-wise-dashboard.component';
import { HostelWiseDashboardComponent } from './Dashboards/hostel-wise-dashboard/hostel-wise-dashboard.component';
import { HostelDashboardComponent } from './Dashboards/hostel-dashboard/hostel-dashboard.component';
import { TotalCountDashboardComponent } from './Dashboards/total-count-dashboard/total-count-dashboard.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { HostelClosingdateEntryComponent } from './hostel-closingdate-entry/hostel-closingdate-entry.component';
import { StudentReportComponent } from './Reports/student-report/student-report.component';
import { EmployeeConfirmationComponent } from './employee-confirmation/employee-confirmation.component';
import { HostelFunctioningTypeMasterComponent } from './master/hostel-functioning-type-master/hostel-functioning-type-master.component';
import { HostelwisedataReportComponent } from './Reports/hostelwisedata-report/hostelwisedata-report.component';
import { SchoolWiseStudentDetailsReportComponent } from './school-wise-student-details-report/school-wise-student-details-report.component';
import { CoursemasterEntryComponent } from './Master-Entry/coursemaster-entry/coursemaster-entry.component';
import { CommoditygroupEntryComponent } from './Master-Entry/commoditygroup-entry/commoditygroup-entry.component';
import { UnitMasterEntryComponent } from './Master-Entry/unit-master-entry/unit-master-entry.component';
import { SubcasteEntryComponent } from './Master-Entry/subcaste-entry/subcaste-entry.component';
import { StudentCertificateDownloadComponent } from './Reports/student-certificate-download/student-certificate-download.component';
import { OnlineApplicationControlComponent } from './master/online-application-control/online-application-control.component';
import { SchoolwiseDocumentUploadComponent } from './schoolwise-document-upload/schoolwise-document-upload.component';
import { StudentIdcardComponent } from './student-idcard/student-idcard.component';
import { SpecialTashildarMasterComponent } from './master/special-tashildar-master/special-tashildar-master.component';
import { TashildarMappingComponent } from './master/tashildar-mapping/tashildar-mapping.component';
import { InstituteMasterEntryComponent } from './institute-master-entry/institute-master-entry.component';
import { OnlineRegisteredStudentReportComponent } from './online-registered-student-report/online-registered-student-report.component';
import { EmployeeVacancyComponent } from './forms-module/employee-vacancy/employee-vacancy.component';
import { EmployeeVacanyDetailsComponent } from './Reports/employee-vacany-details/employee-vacany-details.component';
import { StudentCasteWiseDetailsComponent } from './Reports/student-caste-wise-details/student-caste-wise-details.component';
import { OnlineRegisteredStudentstatusComponent } from './online-registered-studentstatus/online-registered-studentstatus.component';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'foodmaster',component:FoodmasterComponent, canActivate: [AuthGuard]},
  { path: 'hostelmaster',component:HostelmasterComponent, canActivate: [AuthGuard]},
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'warden-details', component: WardenDetailsComponent, canActivate: [AuthGuard]}, 
  { path: 'opening-balance', component: OpeningBalanceComponent, canActivate: [AuthGuard]},
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
  { path: 'opening-balance', component:OpeningBalanceComponent, canActivate: [AuthGuard]},

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
  { path: 'hostelinfrastructure', component:HostelinfrastructureComponent, canActivate: [AuthGuard]}, 
  { path: 'monthlywiseintent', component:MonthlywiseintentComponent,},
  // { path: 'taluk', component:DOFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'ho-fundmanagement', component:HOFundmanagementComponent, canActivate: [AuthGuard]}, 
  { path: 'do-fundmanagement', component:DOFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'to-fundmanagement', component:TOFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'hostel-fundmanagement', component:HostelFundManagementComponent, canActivate: [AuthGuard]},
  { path: 'fund-report', component:FundmanagementReportComponent, canActivate: [AuthGuard]},
  { path: 'student-attendance', component:StudentAttendanceComponent, canActivate: [AuthGuard]},
  
  { path: 'studentfacility', component:StudentfacilityMasterComponent, canActivate: [AuthGuard]},
  { path: 'studentfacilityreport', component:StudentfacilityReportComponent, canActivate: [AuthGuard]},
  { path: 'approvalrequest', component:ApprovalRequestComponent, canActivate: [AuthGuard]},
  { path: 'approval', component:ApprovalComponent, canActivate: [AuthGuard]},

  { path: 'monthlywiseapproval', component:MonthlywiseintentapprovalComponent, canActivate: [AuthGuard]},
  { path: 'hostelinfrareport', component:HostelinfrastructureReportComponent, canActivate: [AuthGuard]},
  { path: 'monthlywisereport', component:MonthlywiseintentReportComponent, canActivate: [AuthGuard]},
  { path: 'feedingchargetypereport', component:FeedingchargestypeReportComponent, canActivate: [AuthGuard]},
  { path: 'employeemaster', component:EmployeeMasterComponent, canActivate: [AuthGuard]},
  { path: 'employeereport', component:EmployeeReportComponent, canActivate: [AuthGuard]},
  { path: 'employeeattendance', component:EmployeeattendanceDetailsComponent, canActivate: [AuthGuard]},
  { path: 'employeeattendancereport', component:EmployeeattendanceReportComponent, canActivate: [AuthGuard]},
  { path: 'biometric', component:  BiometricDevicemappingComponent, canActivate: [AuthGuard]},
  { path: 'foodentitlement', component:  FoodEntitlementComponent, canActivate: [AuthGuard]},
  { path: 'biometricatt-2', component: BiometricattendanceComponent, canActivate: [AuthGuard]},
  { path: 'foodentitlementreport', component:  FoodentitlementReportComponent, canActivate: [AuthGuard]},
  { path: 'BiometricAttendance', component:  BiometricAttendanceComponent, canActivate: [AuthGuard]},
  { path: 'Biometricattendancecount', component: BiometricattendancecountComponent, canActivate: [AuthGuard]},
  { path: 'purchasedetailsreport', component:PurchasedetailsReportComponent, canActivate: [AuthGuard]},
  { path: 'devicemappingreport', component:DevicemappingReportComponent, canActivate: [AuthGuard]},
  { path: 'feedback', component:FeedbackComponent, canActivate: [AuthGuard]},
  { path: 'studentfeedback-registration', component:StudentFeedbackRegistrationComponent},
  { path: 'studentfeedback', component:StudentFeedbackComponent, canActivate: [AuthGuard]},
  { path: 'Hostelgalleryupload', component:HostelgalleryuploadComponent, canActivate: [AuthGuard]},
  
  // { path: 'feedback-registration', component:StudentFeedbackRegistrationComponent, canActivate: [AuthGuard]},
  { path: 'homepage-image-upload', component:HomepageImageUploadComponent, canActivate: [AuthGuard]},
  { path: 'hostel-gallery', component:HostelGalleryComponent, canActivate: [AuthGuard]},
  { path: 'privacy-policy', component:PrivacyPolicyComponent, canActivate: [AuthGuard]},
  { path: 'employee-strength', component:EmployeeStrengthComponent, canActivate: [AuthGuard]},
  { path: 'student-count', component:StudentcountReportComponent, canActivate: [AuthGuard]},
  { path: 'Hostel-Committee', component:HostelCommitteeComponent, canActivate: [AuthGuard]},
  { path: 'total-count-dashboard', component:TotalCountDashboardComponent,  canActivate: [AuthGuard]},
  { path: 'district-wise-dashboard', component:DistrictWiseDashboardComponent, canActivate: [AuthGuard]},
  { path: 'taluk-wise-dashboard', component:TalukWiseDashboardComponent, canActivate: [AuthGuard] },
  { path: 'hostel-wise-dashboard', component:HostelWiseDashboardComponent, canActivate: [AuthGuard] },
  { path: 'hostel-dashboard', component:HostelDashboardComponent, canActivate: [AuthGuard] },
  { path: 'online-registration', component:OnlineRegistrationComponent},
  { path: 'online-check', component:OnlineRegistrationCheckComponent},


  { path: 'application-status', component:ApplicationStatusComponent},
  { path: 'closingdate-entry', component:HostelClosingdateEntryComponent,canActivate: [AuthGuard] },
  // { path: 'student-report', component:StudentReportComponent,canActivate: [AuthGuard] }, 
    { path: 'studentreport', component:StudentReportComponent,canActivate: [AuthGuard] }, 
  { path: 'employee-confirmation', component:EmployeeConfirmationComponent,canActivate: [AuthGuard]},
  { path: 'hostel-functioningtype', component:HostelFunctioningTypeMasterComponent,canActivate: [AuthGuard] }, 
  { path: 'hostelwisedatareport', component:HostelwisedataReportComponent},
  { path: 'Schoolwisestudentdetailsreport', component:SchoolWiseStudentDetailsReportComponent},
  { path: 'Schoolwise-docupload', component:SchoolwiseDocumentUploadComponent,canActivate: [AuthGuard] },
  { path: 'Student-IdCard', component:StudentIdcardComponent,canActivate: [AuthGuard] },

  //master entry,
  { path: 'commoditygroup-entry', component:CommoditygroupEntryComponent,canActivate: [AuthGuard]},
  { path: 'unit-master-entry', component:UnitMasterEntryComponent,canActivate: [AuthGuard]},
  { path: 'subcaste-entry', component:SubcasteEntryComponent,canActivate: [AuthGuard]},
  { path: 'coursemaster-entry', component:  CoursemasterEntryComponent  ,canActivate: [AuthGuard]},
  { path: 'hostel-functioningtype', component:HostelFunctioningTypeMasterComponent,canActivate: [AuthGuard] },
  { path: 'InstituteMaster-Entry', component:InstituteMasterEntryComponent,canActivate: [AuthGuard] },

  { path: 'student-certificate-download', component:StudentCertificateDownloadComponent,canActivate: [AuthGuard] },
  { path: 'OnlineApplicationControl', component:OnlineApplicationControlComponent,canActivate: [AuthGuard] },
  { path: 'specialTashildar-master', component:SpecialTashildarMasterComponent,canActivate: [AuthGuard] },
  { path: 'tashildar-mapping', component:TashildarMappingComponent,canActivate: [AuthGuard] },
  { path: 'onlineregisteredstudent-report', component:OnlineRegisteredStudentReportComponent,canActivate: [AuthGuard] },
  { path: 'employeevacany-entry', component:EmployeeVacancyComponent,canActivate: [AuthGuard] },
  { path: 'employeevacany-report', component:EmployeeVacanyDetailsComponent,canActivate: [AuthGuard] },
  { path: 'studentcategorywise-report', component:StudentCasteWiseDetailsComponent,canActivate: [AuthGuard] },
  { path: 'onlineregisteredstudent-status', component:OnlineRegisteredStudentstatusComponent,canActivate: [AuthGuard] },

   

   
   
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
