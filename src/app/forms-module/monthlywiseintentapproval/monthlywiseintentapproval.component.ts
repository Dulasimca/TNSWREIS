import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { textChangeRangeIsUnchanged } from 'typescript';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { TabView } from 'primeng/tabview';


@Component({
  selector: 'app-monthlywiseintentapproval',
  templateUrl: './monthlywiseintentapproval.component.html',
  styleUrls: ['./monthlywiseintentapproval.component.css']
})



export class MonthlywiseintentapprovalComponent implements OnInit {

  taluk: any;
  hostelName: any;
  district: any;
  unitOptions:  SelectItem[];
  quantity: any;
  data: any = [];
  showTable: boolean;
  monthwiseint: number;
  logged_user: User;
  units?: any;
  years?: any;
  date:any
  cols:any
  selectedIndex = 0;
  loginHeader: string = 'Student Login';



    @ViewChild('tabview', { static: false }) _tabView: TabView;
  @ViewChild('f', { static: false }) monthlywiseintentapproval: NgForm;

  constructor(private restApiService: RestAPIService, private messageService: MessageService,
    private masterService: MasterService, private _masterService: MasterService, private _datePipe: DatePipe, private _authService: AuthService, private authService: AuthService) { }

  ngOnInit(): void {
    this.logged_user = this.authService.UserInfo;
    this.district = this.logged_user.districtName;
    this.taluk = this.logged_user.talukName;
    this.hostelName = this.logged_user.hostelName;

     
    
  }
  @ViewChild('f', { static: false }) monthlyintapproval: NgForm;

  onSelect(type) {
    
    }
  
    onTabChange($event) {
      this.selectedIndex = $event.index;
      this.loginHeader = this._tabView.tabs[this.selectedIndex].header + ' ' + 'Login';
      this.monthlywiseintentapproval.reset();
      this.monthlywiseintentapproval.form.markAsUntouched();
      this.monthlywiseintentapproval.form.markAsPristine();
    }
  

  onView()
{

}
onRowSelect(event, selectedRow) {
}


}
