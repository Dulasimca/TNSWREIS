import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-student-transfer-form',
  templateUrl: './student-transfer-form.component.html',
  styleUrls: ['./student-transfer-form.component.css']
})
export class StudentTransferFormComponent implements OnInit {
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  login_user: User;
  studentDetailCols: any;
  studentDetails: any[] = [];
  loading: boolean;

  constructor(private _masterService: MasterService, private _authService: AuthService,
    private _restApiService: RestAPIService, private _messageService: MessageService,
    private _tableConstants: TableConstants,) { }

  ngOnInit(): void {
    this.years = this._masterService.getMaster('AY');
    this.login_user = this._authService.UserInfo;
    this.studentDetailCols = this._tableConstants.studentAcademicStatusDetailsColumns;
  }

  onSelect() {
    let yearSelection = [];
    this.years.forEach(y => {
      yearSelection.push({ label: y.name, value: y.code });
    })
    this.yearOptions = yearSelection;
    this.yearOptions.unshift({ label: '-select', value: null });
  }

  loadStudentDetails() {
    if (this.year !== undefined && this.year !== null) {
      this.loading = true;
      const params = {
        'AcademicYear': this.year,
        'HostelId': this.login_user.hostelId
      }
      this._restApiService.getByParameters(PathConstants.StudentTransferDetails_Get, params).subscribe(res => {
        if (res !== undefined && res !== null) {
          if (res.length !== 0) {
            this.studentDetails = res;
            this.loading = false;
          } else {
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
            });
          }
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          });
        }
      })
    }
  }

  click() {
    console.log('data', this.studentDetails);
  }
}
