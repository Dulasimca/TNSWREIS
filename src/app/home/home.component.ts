import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: any[];
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

  constructor() { }

  ngOnInit(): void {
    this.images = [
      {
        "previewImageSrc": '../assets/layout/images/home.png',
        "alt": "Description for Image 1",
        "title": "Title 0"
    },
      {
          "previewImageSrc": '../assets/layout/images/hstl.jpg',
          "alt": "Description for Image 1",
          "title": "Title 1"
      },
      {
          "previewImageSrc": '../assets/layout/images/mess.jpg',
          "alt": "Description for Image 2",
          "title": "Title 2"
      },
      {
          "previewImageSrc": '../assets/layout/images/yoga.jpg',
          "alt": "Description for Image 3",
          "title": "Title 3"
      },
      {
          "previewImageSrc": '../assets/layout/images/hostelroom.jpeg',
          "alt": "Description for Image 4",
          "title": "Title 4"
      },
      {
        "previewImageSrc": '../assets/layout/images/home.png',
        "alt": "Description for Image 1",
        "title": "Title 5 "
    },
    ];
  }

}
