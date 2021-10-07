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
import {RadioButtonModule} from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import {ToastModule} from 'primeng/toast';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RegistrationComponent } from './forms-module/registration/registration.component';
import { FoodmasterComponent } from './master/foodmaster/foodmaster.component';
import { HostelmasterComponent } from './master/hostelmaster/hostelmaster.component';
import { WardenDetailsComponent } from './forms-module/registration/warden-details/warden-details.component';
 
import { CameraComponent } from './Feature-module/camera/camera.component';

import { MasterService } from './services/master-data.service';
import { RestAPIService } from './services/restAPI.service';
import { CommodityMasterComponent } from './master/commodity-master/commodity-master.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { MessageService } from 'primeng/api';

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
    FoodmasterComponent,
    WardenDetailsComponent,
    CameraComponent,
    CommodityMasterComponent,
    OpeningBalanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    RadioButtonModule,
    TableModule,
    ToastModule
  ],
  providers: [RestAPIService, MasterService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
