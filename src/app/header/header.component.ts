import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
headerText: string;
subHeader: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.headerText = 'Government Of Tamilnadu';
    this.subHeader = 'Social Welfare Department';
  }

  onSignIn() { 
    console.log('sign in');
    this.router.navigate(['/login']);
  }
}
