import { Observable } from "rxjs";

export interface ComponentCanDeactivate {

    confirmBox :()=> boolean | Observable<boolean> |Promise<boolean> 
}
