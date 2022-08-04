import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inside-sales-navbar',
  templateUrl: './inside-sales-navbar.component.html',
  styleUrls: ['./inside-sales-navbar.component.scss'],
})
export class InsideSalesNavbarComponent implements OnInit {
  @ViewChild('overlay') overlay!: ElementRef;
  adminData: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const query = window.matchMedia('(max-width: 700px)');
    console.log(query);
    this.adminData = this.tokenStorage.getUser();
  }

  closeOverLay() {
    const query = window.matchMedia('(max-width: 700px)');
    if (query.matches) {
      this.overlay.nativeElement.click();
    }
  }

  logout() {
    this.tokenStorage.signOut();
    return this.router.navigate(['/']);
  }
}
