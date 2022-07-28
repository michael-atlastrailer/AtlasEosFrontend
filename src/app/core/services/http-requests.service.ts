import { Injectable } from '@angular/core'

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { TokenStorageService } from './token-storage.service'
import { Router } from '@angular/router'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
}

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {
  title: any
  private basePath = '/news_update'
  apiUrl = environment.url
  cartNum = new Subject<any>()

  fileUploadUrl: string = ''

  token!: any

  alert = {
    status: false,
    message: '',
    badge: 'info',
  }

  constructor(
    public http: HttpClient,
    private tokenStorage: TokenStorageService,
    public router: Router,
  ) {
    this.token = this.tokenStorage.getToken()
  }

  uploadFile(route: string, up: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + route, up)
        .toPromise()
        .then(
          (res) => {
            resolve(res)
          },
          (err) => {
            reject(err)
          },
        )
    })
  }

  httpPostRequest(route: string, data: any = false, error = true) {
    return new Promise((resolve) => {
      this.http.post(this.apiUrl + route, data, httpOptions).subscribe(
        (response: any) => {
          this.checkAuthorization(response)
          resolve(response)
        },
        (error) => {
          this.checkAuthorization(error)
          resolve(error)
        },
      )
    })
  }

  httpGetRequest(route: string, data: any = false, error = true) {
    return new Promise((resolve) => {
      this.http.get(this.apiUrl + route).subscribe(
        (response: any) => {
          //this.checkAuthorization(response);
          //console.log(response);
          resolve(response)
        },
        (error: any) => {
          //this.checkAuthorization(error);
          //console.log(error);

          resolve(error)
        },
      )
    })
  }

  checkAuthorization(result: any) {
    if (result.status_code == 401 || result.message == 'Unauthorized') {
      this.tokenStorage.signOut()
      setTimeout(() => {
        this.router.navigate(['/'])
      }, 2000)
    }
  }

  handleError(
    message: any,
    nature = 'info',
    httpError: any = false,
    input: any = false,
  ) {
    switch (nature) {
      case 'success':
        break
      case 'info':
        break
      case 'danger':
        break
      case 'warning':
        break

      default:
        break
    }
  }
}
