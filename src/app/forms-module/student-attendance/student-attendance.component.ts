import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any
  date: Date = new Date();
  studentName: any;
  studentOptions: SelectItem[];
  selectedType: number;
  remarks: any;
  logged_user: User;
  studentAttendanceData : any = [];
  StudentAttendanceCols: any = [];
  showTable: boolean;

  constructor(private authService: AuthService, private _tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.logged_user = this.authService.UserInfo;
    this.district = this.logged_user.districtName;
    this.taluk = this.logged_user.talukName;
    this.hostelName = this.logged_user.hostelName;
    this.StudentAttendanceCols = this._tableConstants.StudentAttendanceTable
  }
  onSelect(type) {

  }
  onEnter() {

  }
  loadTable() {
    this.showTable = true;
  }

}
