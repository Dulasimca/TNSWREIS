import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
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
  showHeader: boolean;
  @ViewChild('dt', { static: false }) _table: Table;
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
    if ($event !== undefined && $event !== null) {
      this.studentDetails.forEach(x => {
        if (x.StudentId === $event.data.StudentId || x.showStatusSelector === 'true') {
          x.checked = true;
          x.showStatusSelector = 'true';
          this.showHeader = true;
        } else {
          x.showStatusSelector = 'false';
        }
      })
    }
  }

  onRowUnselect($event) {
    if ($event !== undefined && $event !== null) {
      this.studentDetails.forEach(x => {
        if (x.StudentId === $event.data.StudentId) {
          x.showStatusSelector = 'false';
          x.checked = false;
        }
      })
      if(this.selectedStudentList.length !== 0) {
      this.selectedStudentList.forEach((s, index) => {
        if (s.StudentId === $event.data.StudentId) {
          this.selectedStudentList.splice(index, 1);
        }
      })
    }
      this._table.value = this.studentDetails;
    } else {
      this.showHeader = false;
    }
  }

  onSelectToTransfer(data, status) {
    this.selectedStudentList.push({
      'Id': data.StudentId,
      'HostelId': data.HostelID,
      'StudentId': data.StudentId,
      'AcademicYear': data.AcademicYear,
      'EMISNO': data.Emisno,
      'Remarks': data.Remarks,
      'AcademicStatus': (status === 1) ? 1 : 0, //1 = pass & 0 = fail (in student approval table)
      'Flag': 1, // default
    })
  }

  unSelectedStudents() {
    if (this.studentDetails.length !== 0) {
      this.unSelectedStudentList = [];
      this.studentDetails.forEach(s => {
        this.unSelectedStudentList.push({
          'Id': s.StudentId,
          'HostelId': s.HostelID,
          'StudentId': s.StudentId,
          'AcademicYear': s.AcademicYear,
          'EMISNO': s.Emisno,
          'Remarks': s.Remarks,
          'AcademicStatus': 1, //discontinued (in student table)
          'Flag': 1 // default
        })
      })
      if (this.selectedStudentList.length !== 0) {
        this.unSelectedStudentList = [];
        this.selectedStudentList.forEach(s => {
          this.studentDetails.forEach(d => {
            if (s.StudentId !== d.StudentId) {
              this.unSelectedStudentList.push({
                'Id': d.StudentId,
                'HostelId': d.HostelID,
                'StudentId': d.StudentId,
                'AcademicYear': d.AcademicYear,
                'EMISNO': d.Emisno,
                'Remarks': d.Remarks,
                'AcademicStatus': 2, //discontinued 
                'Flag': 1 // default
              })
            }
          })
        })
      }
    }
  }

  onToggle(data) {
    console.log('data', data)

  }

  isStudentStatus(): [boolean, string] {
    var isValid;
    var msg = '';
    if (this.studentDetails.length !== 0) {
      var checkedList = this.studentDetails.filter(f => {
        return f.checked;
      })
      this.studentDetails.forEach(t => {
        if (t.checked && this.selectedStudentList.length === 0) {
          msg = 'Please choose pass/fail for all selected students !';
          isValid = false;
        } else if (checkedList.length > this.selectedStudentList.length) {
          msg = 'Please choose pass/fail for all selected students !';
          isValid = false;
        } else {
          msg = '';
          isValid = true;
        }
      })
      return [isValid, msg];
    }
  }

  onSubmit() {
    this.unSelectedStudents();
    var result: [boolean, string] = this.isStudentStatus();
    const isValid = result[0];
    const msg = result[1];
    if (isValid) {
      this._restApiService.post(PathConstants.StudentTransferDetails_Post, this.selectedStudentList).subscribe(res => {
        if (res) {
          console.log('student data is inserted successfully')
        } else {
          console.log('student data is not inserted')
        }
      })
      this._restApiService.put(PathConstants.StudentTransferDetails_Put, this.unSelectedStudentList).subscribe(res => {
        if (res) {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        }
      })
    } else {
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: msg
      });
    }
  }
}
