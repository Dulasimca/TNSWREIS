import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/Services/restAPI.service';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import { HttpClient} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-hostelgallery',
  templateUrl: './hostelgallery.component.html',
  styleUrls: ['./hostelgallery.component.css']
})
export class HostelgalleryComponent implements OnInit {
  Hostelactivityimages: any;
  imagefilenam: any;
  logged_user: User;
  date: Date = new Date(); 
  @ViewChild('userFile', { static: false }) _HostelImg: ElementRef;private _datePipe: DatePipe                               
  
  constructor(private _restApiService: RestAPIService,private messageService: MessageService, private _d: DomSanitizer,
  private _authService: AuthService, private http: HttpClient) { }
  
  ngOnInit() {
     this.logged_user = this._authService.UserInfo;
       
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
      const folderName = this.logged_user.hostelId + '/' + 'Documents';
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



