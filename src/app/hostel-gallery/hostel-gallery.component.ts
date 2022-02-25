import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-hostel-gallery',
  templateUrl: './hostel-gallery.component.html',
  styleUrls: ['./hostel-gallery.component.css']
})
export class HostelGalleryComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?; any;
  images: any[];
  data: any = [];
  logged_user: User;
  responsiveOptions:any[] = [
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
  constructor(private masterService: MasterService, private restApiService :RestAPIService) { }

  ngOnInit(): void {
    
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.images= [
          {
            'previewImageSrc': '../../assets/layout/Home/Documents/TN_ADW_Food_Inspection.png',
            'thumbnailImageSrc':'../../assets/layout/Home/Documents/TN_ADW_Food_Inspection.png',
            'alt': 'Description for Image 1',
            'title': 'Title 1'
        },
        {
          'previewImageSrc': '../../assets/layout/Home/Documents/TN_ADW_Hostel_Ground.png',
          'thumbnailImageSrc':'../../assets/layout/Home/Documents/TN_ADW_Hostel_Ground.png',
            'alt': 'Description for Image 2',
            'title': 'Title 2'
        },
        {
          'previewImageSrc': '../../assets/layout/Home/Documents/TN_ADW_Hostel_Image.png',
          'thumbnailImageSrc':'../../assets/layout/Home/Documents/TN_ADW_Hostel_Image.png',
          'alt': 'Description for Image 1',
          'title': 'Title 1'
      },
      {
        'previewImageSrc': '../../assets/layout/Home/Documents/TN_ADW_Food_Inspection.png',
        'thumbnailImageSrc':'../../assets/layout/Home/Documents/TN_ADW_Food_Inspection.png',
        'alt': 'Description for Image 1',
        'title': 'Title 1'
    },
    {
      'previewImageSrc': '../../assets/layout/Home/Documents/TN_ADW_Hostel_Image.png',
      'thumbnailImageSrc':'../../assets/layout/Home/Documents/TN_ADW_Hostel_Image.png',
      'alt': 'Description for Image 1',
      'title': 'Title 1'
  },
  {
    'previewImageSrc': '../../assets/layout/Home/Documents/TN_ADW_Hostel_Ground.png',
    'thumbnailImageSrc':'../../assets/layout/Home/Documents/TN_ADW_Hostel_Ground.png',
      'alt': 'Description for Image 2',
      'title': 'Title 2'
  },
      ]
    }

    onSelect(type) {
      let districtSelection = [];
      let talukSelection = [];
      switch (type) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          this.districtOptions.unshift({ label: '-select', value: null });
          break;
        case 'T':
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          this.talukOptions.unshift({ label: '-select', value: null });
          break;
      }
    }

    refreshFields(value) {
      if(value === 'D') {
        this.taluk = null;
        this.talukOptions = [];
      } 
      this.selectDistrict();
    }

     // hstl based on district 
  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if(this.district !== undefined && this.district !== null && this.taluk !== undefined && this.taluk !== null){
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
          this.hostelOptions = hostelSelection;
          this.hostelOptions.unshift({ label: '-select', value: null });
        };
      })
    }
  }
  }

  loadTable() {

  }

}
