import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { AuthGuard } from 'src/app/services/auth.guard';
import { RestAPIService } from 'src/app/Services/restAPI.service';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import { HttpClient} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { MessageService,SelectItem } from 'primeng/api';
import { MasterService } from '../../services/master-data.service';


@Component({
  selector: 'app-hostelgalleryupload',
  templateUrl: './hostelgalleryupload.component.html',
  styleUrls: ['./hostelgalleryupload.component.css']
})
export class HostelgalleryuploadComponent implements OnInit {
  Hostelactivityimages: any;
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  imagefilenam: any;
  logged_user: User;
  date: Date = new Date(); 

  @ViewChild('userFile', { static: false }) _HostelImg: ElementRef;                             
  
  constructor(private masterService: MasterService,private _restApiService: RestAPIService,private messageService: MessageService, private _d: DomSanitizer,
  private _AuthGuard:  AuthGuard, private _authService: AuthService, private http: HttpClient,private _datePipe: DatePipe) { }
  
  ngOnInit(): void {
    
     this.logged_user = this._authService.UserInfo;
     this.years = this.masterService.getMaster('AY');
   }
   onSelect(type) {   
    let yearSelection = [];    
    switch (type) {      
      case 'Y':
        var filtered_data = [];
        filtered_data = this.years.filter(y => {
          return y.type === 1;         
        })        
      filtered_data.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        console.log('t',this.years)
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
        break;    
    }
  }
   onFileUpload($event, id) {
    const selectedFile = $event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const s_url = window.URL.createObjectURL(selectedFile);
        this.Hostelactivityimages = this._d.bypassSecurityTrustUrl(s_url);
        //this.imagefilenam = this.uploadFile($event.target.files);
        this.imagefilenam = $event.target.files;       
    }
    public uploadFile = (files) => {
      if (files.length === 0) {
        return;
      }
      var formData = new FormData()
      let fileToUpload: any = <File>files[0];
      let actualFilename = '';
      const subfolder = this.years.value;
      console.log(subfolder)
      const folderName = this.logged_user.hostelId + '/' + 'Events' +'/' + '2021-2022';
      const filename = fileToUpload.name + '^' + folderName;
      formData.append('file', fileToUpload, filename);
      actualFilename = fileToUpload.name;
      this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
        .subscribe((event: any) => {
        }
        );
        return actualFilename;
    }
    onSubmit(){
          this.uploadFile(this.imagefilenam);
          this.messageService.clear();
          this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
    });
  }
    clearForm() {
      this.defaultValues();
    }
    defaultValues(){
      this.Hostelactivityimages = 'assets/layout/'+ this.logged_user.hostelId +'/Documents/'+ 'Mohan.jpg';
      this.imagefilenam ='';
  }
  }



