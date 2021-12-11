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
  selectedStudentList: any[] = [];
  unSelectedStudentList: any[] = [];
  studentStatus: number;
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
            res.forEach(r => {
              r.showStatusSelector = 'false';
            })
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

  onRowSelect($event) {
    console.log('ee', $event)
    if ($event !== undefined && $event !== null) {
      this.studentDetails.forEach(x => {
        if (x.StudentId === $event.data.StudentId || x.showStatusSelector === 'true') {
          x.showStatusSelector = 'true';
        } else {
          x.showStatusSelector = 'false';
        }
      })
    }
  }

  onRowUnselect($event) {
    if ($event !== undefined && $event !== null && this.selectedStudentList.length !== 0) {
      this.studentDetails.forEach(x => {
        if (x.StudentId === $event.data.StudentId) {
          x.showStatusSelector = 'false';
        } 
      })
      this.selectedStudentList.forEach((s, index) => {
        if (s.StudentId === $event.data.StudentId) {
          this.selectedStudentList.splice(index, 1);
        }
      })
    }
    console.log('unselect', this.selectedStudentList)
  }

  //remarks
  onSelectToTransfer(data, status) {
    this.selectedStudentList.push({
      'Id': data.StudentId,
      'HostelId': data.HostelID,
      'StudentId': data.StudentId,
      'AcademicYear': data.AcademicYear,
      'EMISNO': data.Emisno,
      'AcademicStatus': (status === 1) ? 1 : 0, //1 = pass & 0 = fail
      'Flag': 1 // default
    })
    console.log('select', this.selectedStudentList)
    this.unSelectedStudents()
  }

  unSelectedStudents() {
    if (this.studentDetails.length !== 0) {
      if (this.selectedStudentList.length !== 0) {
        this.studentDetails.forEach(sd => {
          this.selectedStudentList.forEach(ss => {
            if (ss.StudentId !== sd.StudentId) {
              this.unSelectedStudentList.push({
                'Id': sd.StudentId,
                'HostelId': sd.HostelID,
                'StudentId': sd.StudentId,
                'AcademicYear': sd.AcademicYear,
                'EMISNO': sd.Emisno,
                'AcademicStatus': 2, //discontinued 
                'Flag': 1 // default
              })
            }
          })
        })
      } else {
        this.studentDetails.forEach(s => {
          this.unSelectedStudentList.push({
            'Id': s.StudentId,
            'HostelId': s.HostelID,
            'StudentId': s.StudentId,
            'AcademicYear': s.AcademicYear,
            'EMISNO': s.Emisno,
            'AcademicStatus': 2, //discontinued 
            'Flag': 1 // default
          })
        })
      }
    }
    console.log('unselected', this.selectedStudentList)
  }
}
