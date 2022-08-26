import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PrevRouteService {
  previousUrl: string = '';
  currentUrl: string = '';

  constructor(private router: Router) {
   
  }
 
}
