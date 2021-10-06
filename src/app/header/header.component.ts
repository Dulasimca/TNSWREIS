import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
headerText: string;
subHeader: string;
@Input() showMenuIcon = false;
// @Output() open = new EventEmitter<boolean>();
showNavBar: boolean;
items: any[];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.headerText = 'Government Of Tamilnadu';
    this.subHeader = 'Social Welfare Department';
  }

  onSignIn() { 
    console.log('sign in');
    this.router.navigate(['/login']);
  }

  // onEmit() {
  //   console.log('emit');
  //   this.open.emit(true);
  // }
}
