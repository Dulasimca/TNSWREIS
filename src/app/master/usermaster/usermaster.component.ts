import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-usermaster',
  templateUrl: './usermaster.component.html',
  styleUrls: ['./usermaster.component.css']
})
export class UsermasterComponent implements OnInit {

  userName:any;
  emailId: any;
  password: any;
  role: number;
  district: number;
  taluk: number;
  hostelName: number;
  selectedType: number;
  roleOptions: SelectItem[];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  userMasterId: number;
  data: any = [];
// master
  roles?: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
// rolemethod
  showDistrict: boolean;
  showTaluk: boolean;
  showHostelName: boolean;
  showTable: boolean;
  @ViewChild('f', { static: false }) _usermaster: NgForm;


  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.roles = this.masterService.getMaster('RM');
    this.onView();
  }

    onSelect(type) {
      let districtSelection = [];
      let talukSelection = [];
      let hostelSelection = [];
      let roleSelection = [];
      switch (type) {
        case 'R':
          this.roles.forEach(r => {
            roleSelection.push({ label: r.name, value: r.code });
          })
          this.roleOptions = roleSelection;
          this.roleOptions.unshift({ label: '-select', value: null });
          break;
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          this.districtOptions.unshift({ label: '-select', value: null });
          break;
          case 'T':
            this.taluks.forEach(t => {
              talukSelection.push({ label: t.name, value: t.code });
            })
            this.talukOptions = talukSelection;
            this.talukOptions.unshift({ label: '-select', value: null });
            break;
            case 'HN':
              this.hostels.forEach(h => {
                hostelSelection.push({ label: h.HostelName, value: h.Slno });
              })
              this.hostelOptions = hostelSelection;
              this.hostelOptions.unshift({ label: '-select', value: null });
              break;
  }
}
selectDistrict() {
  const params = {
    'Type': 1,
    'Value': this.district

  }
  if(this.district !== null && this.district !== undefined){
    this.restApiService.getByParameters(PathConstants.Hostel_Get,params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0){
        this.hostels = res;
      };
    
    })
  }
}
onRoleChange() {
  console.log('role', this.role)
  if(this.role != undefined && this.role !== null){
    if (this.role===1){
      this.showDistrict = false;
      this.showTaluk = false;
      this.showHostelName = false;
    }else if(this.role===2){
      this.showTaluk = false;
      this.showDistrict = true;
      this.showHostelName = false;
    }else if(this.role===3){
      this.showDistrict = true;
      this.showTaluk = true;
      this.showHostelName = false;
    }else if(this.role===4){
      this.showDistrict = true;
      this.showTaluk = true;
      this.showHostelName = true
    }else{
      this.showDistrict = false;
      this.showTaluk = false;
      this.showHostelName = false;
    }
  }
}
  onSubmit(){
    const params = {
      'Id': this.userMasterId,
      'Districtcode': (this.district !== undefined && this.district !== null) ? this.district : 0,
      'HostelID': (this.hostelName !== undefined && this.hostelName !== null) ? this.hostelName : 0,
      'Talukid': (this.taluk !== undefined && this.taluk !== null) ? this.taluk : 0,
      'UserName': this.userName,
      'EMailId': this.emailId,
      'RoleId': (this.role !== undefined && this.role !== null) ? this.role : 0,
      'Pwd': this.password,
      'Flag': (this.selectedType * 1),
    }
    this.restApiService.post(PathConstants.UserMaster_Post,params).subscribe(res => {
      if (res) {
        this.clearForm();
        this.onView();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }
  onView() {
    this.showTable = true;
    this.restApiService.get(PathConstants.UserMaster_Get).subscribe(res => {
      if (res !== null && res !== undefined && res.Table.length !== 0){
        res.Table.forEach(i => {
          i.status = (i.Flag) ? 'Active' : 'Inactive';
        })
        this.data = res.Table;
      }
    })
 }
 onEdit(selectedRow) {
   if(selectedRow !== null && selectedRow !==undefined){
     this.userMasterId = selectedRow.Id;
     this.role = selectedRow.RoleId;
     this.roleOptions = [{ label: selectedRow.Role, value: selectedRow.RoleId }];

     this.district = selectedRow.Districtcode;
     this.taluk = selectedRow.Talukid;
     this.talukOptions = [{ label: selectedRow.Talukname, value: selectedRow.Talukid }];
     this.hostelName = selectedRow.HostelID;
     this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.HostelID }];

     this.userName = selectedRow.UserName;
     this.emailId = selectedRow.EMailId;
     this.password = selectedRow.Pwd;
     this.districtOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode }];
     this.selectedType =selectedRow.Flag;
   }
   this.onRoleChange();
 }
 clearForm() {
   this._usermaster.reset();
 }
 checkIfEmailExists($event) {
  //  console.log('$event',$event)
  //  if($event !== undefined && $event.data !== null && this.data.length !== 0) {
  //    let input: string = $event.data;
  //    input = input.toLowerCase();
  //   if(input.includes('@')) {
  //     console.log('Yes')
  //     this.data.forEach(d =>{
  //       let userEmail: string = (d.EmailId !== undefined && d.EmailId !== null) ? d.EmailId : '';
  //       userEmail = userEmail.toLowerCase();
  //       console.log(userEmail, input);
  //       if(userEmail !== '' && input !== '') {
  //         if(userEmail === input) {
  //           this.messageService.clear();
  //           this.messageService.add({
  //             key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
  //             summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.EmailAlreadyExists
  //           })
  //           this._usermaster.controls._district.reset();
  //         }
  //       }
  //     })
  //   }
  //     else{console.log('No')}
  //   }
   }
 }
  

