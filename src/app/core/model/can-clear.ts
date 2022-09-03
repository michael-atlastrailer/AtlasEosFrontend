import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  clearSearch: () => boolean | Observable<boolean> ;
}
