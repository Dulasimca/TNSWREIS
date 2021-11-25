import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import {GalleriaModule} from 'primeng/galleria';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RegistrationComponent } from './forms-module/registration/registration.component';
import { FoodmasterComponent } from './master/foodmaster/foodmaster.component';
import { HostelmasterComponent } from './master/hostelmaster/hostelmaster.component';
import { WardenDetailsComponent } from './forms-module/warden-details/warden-details.component';
import { CameraComponent } from './Feature-module/camera/camera.component';
import { CommodityMasterComponent } from './master/commodity-master/commodity-master.component';
import { OpeningBalanceComponent } from './forms-module/opening-balance/opening-balance.component';

import { MasterService } from './services/master-data.service';
import { RestAPIService } from './services/restAPI.service';
import { MessageService } from 'primeng/api';
import { UsermasterComponent } from './master/usermaster/usermaster.component';
import { DistrictComponent } from './master/district/district.component';
import { TalukComponent } from './master/taluk/taluk.component';
import { DatePipe } from '@angular/common';
import { BlockUIModule } from 'ng-block-ui';
import { AttendanceComponent } from './forms-module/attendance/attendance.component';
import { HostelImageComponent } from './master/hostel-image/hostel-image.component';
import { PurchaseOrderComponent } from './forms-module/purchase-order/purchase-order.component';
import { ConsumptionComponent } from './forms-module/consumption/consumption.component';
import { TableConstants } from './Common-Modules/table-constants';
import { HostelGoComponent } from './master/hostel-go/hostel-go.component';
import { ChangePasswordComponent } from './master/change-password/change-password.component';
import { PasswordModule } from "primeng/password";
import { IdCardInfoComponent } from './id-card-info/id-card-info.component';

import { LocationService } from './services/location.service';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendanceReportComponent } from './Reports/attendance-report/attendance-report.component';
import { WardenReportComponent } from './Reports/warden-report/warden-report.component';
import { AttendanceImageComponent } from './forms-module/attendance-image/attendance-image.component';
import { DailyconsumptionReportComponent } from './Reports/dailyconsumption-report/dailyconsumption-report.component';
import { PurchaseorderReportComponent } from './Reports/purchaseorder-report/purchaseorder-report.component';
import { HostelReportComponent } from './Reports/hostel-report/hostel-report.component';
import { StudentDetailsComponent } from './Reports/student-details/student-details.component';
import { PurchaseUploadComponent } from './forms-module/purchase-upload/purchase-upload.component';
import { OpeningbalanceReportComponent } from './Reports/openingbalance-report/openingbalance-report.component';
import { InputFormatDirective } from './directives/input-format.directive';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    FoodmasterComponent,
    HostelmasterComponent,
    RegistrationComponent,
    WardenDetailsComponent,
    CameraComponent,
    UsermasterComponent,
    CommodityMasterComponent,
    OpeningBalanceComponent,
    HostelImageComponent,
    PurchaseOrderComponent,
    ConsumptionComponent,
    DistrictComponent,
    TalukComponent,
    HostelGoComponent,
    AttendanceComponent,
    ChangePasswordComponent,
    IdCardInfoComponent,
    MenuHeaderComponent,
    SidenavListComponent,
    DashboardComponent,
    AttendanceReportComponent,
    WardenReportComponent,
    AttendanceImageComponent,
    DailyconsumptionReportComponent,
    PurchaseorderReportComponent,
    HostelReportComponent,
    StudentDetailsComponent,
    OpeningbalanceReportComponent,
    PurchaseUploadComponent,
    InputFormatDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DropdownModule,
    HttpClientModule,
    WebcamModule,
    SidebarModule,
    PanelMenuModule,
    PanelModule,
    TabViewModule,
    CalendarModule,
    PasswordModule,
    RadioButtonModule,
    TableModule,
    CheckboxModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MenubarModule,
    ChartModule,
    GalleriaModule,
    BlockUIModule.forRoot(),
  ],


  providers: [RestAPIService, MasterService, MessageService, DatePipe, TableConstants, LocationService,
    ConfirmationService],

  bootstrap: [AppComponent]

})
export class AppModule { }
