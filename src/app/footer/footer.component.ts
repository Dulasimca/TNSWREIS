import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
// footerText: string;
  constructor() { }

  ngOnInit(): void {
    // const current_year = new Date().getFullYear();
    // this.footerText = current_year + ' ' + ' - All Rights Reserved - Government of Tamilnadu'
  }

}
