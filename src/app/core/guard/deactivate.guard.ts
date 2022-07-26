import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TestShowOrderComponent } from 'src/app/components/dealers/test-show-order/test-show-order.component';
import Swal from 'sweetalert2';
import { ComponentCanDeactivate } from '../model/can-deactivate';



@Injectable({
  providedIn: 'root',
})
export class DeactivateGuard implements CanDeactivate<any> {
  component: any;
 
  canDeactivate(
    component: ComponentCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
   return  component.confirmBox()? component.confirmBox():true
  }
}
