import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PathConstants } from '../Common-Modules/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  images: any[] = [];
  homeImageData: any[] = [];
  newApplications: any = [];
  updateApplications: any = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(private restApiService: RestAPIService) { }

  ngOnInit(): void {
    var path = 'assets/layout/Home/Documents/';
    this.restApiService.get(PathConstants.HomePageImageUpload_Get).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          res.forEach(i => {
            this.homeImageData.push({
              "previewImageSrc": path + i.ImageFilename,
              "alt": i.ImageTitle,
              "title": i.ImageTitle
            })
          })
        }
      }
    })
    this.newApplications.push(
      { slno: '1.', type: 'ஆதிதிராவிடர் நல கல்லூரி விடுதிகள்', start: '18.07.2022', end: '05.08.2022' },
      { slno: '2.', type: 'ஆதிதிராவிடர் நல பள்ளி விடுதிகள்', start: '05.07.2022', end: '20.07.2022' }
    );
    this.updateApplications.push(
      { slno: '1.', type: 'ஆதிதிராவிடர் நல கல்லூரி விடுதிகள்', start: '05.07.2022', end: '25.07.2022' },
      { slno: '2.', type: 'ஆதிதிராவிடர் நல பள்ளி விடுதிகள்', start: '05.07.2022', end: '15.07.2022' }
    )
  }

  ngAfterViewInit(): void {
    this.images = this.homeImageData;
  }

 
}
