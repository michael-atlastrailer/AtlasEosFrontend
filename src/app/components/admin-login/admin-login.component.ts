import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { Login } from 'src/app/core/model/login'
import { ToastrService } from 'ngx-toastr'

// import { TranslateService } from '@ngx-translate/core';
import { DealerLoggerService } from 'src/app/core/services/dealer-logger.service'
import { HttpClient } from '@angular/common/http'
import { OrderCheckService } from 'src/app/core/services/order-check.service'

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  loginText = true
  loginLoader = false

  currentPasswordState = 'password'
  closeEye = true
  openEye = false
  passwordState = false

  @ViewChild('password') pass!: ElementRef

  ipAddress = ''
  browserName = ''
  location = ''
  dealer = ''
  broData: any

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private tokenStorage: TokenStorageService,
    private toastr: ToastrService,
    // public translate: TranslateService,
    private logger: DealerLoggerService,
    private getData: HttpRequestsService,
    private http: HttpClient,
    private ordercheckservice: OrderCheckService,
  ) {
    // translate.addLangs(['en', 'nl'])
    // translate.setDefaultLang('en')
  }

  switchLang() {
    /// this.translate.use('nl')
  }

  login = new Login('', '', '')

  showPassword() {
    if (this.passwordState) {
      this.currentPasswordState = 'password'
      this.closeEye = true
      this.openEye = false
      this.passwordState = false
    } else {
      this.currentPasswordState = 'text'
      this.closeEye = false
      this.openEye = true
      this.passwordState = true
    }
  }

  ngOnInit(): void {
    this.getIPAddress()
    this.browserName = this.detectBrowserName()
    this.fullBrowserData()
  }

  callLogger() {
    let data = {
      dealer: this.dealer,
      ip_address: this.ipAddress,
      location: this.location,
      browser: this.browserName,
      broData: this.broData,
    }
    this.postData
      .httpPostRequest('/log-dealer', data)
      .then((result: any) => {})
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong')
      })
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge'
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera'
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'google chrome'
      case agent.indexOf('trident') > -1:
        return 'ie'
      case agent.indexOf('firefox') > -1:
        return 'mozilla firefox'
      case agent.indexOf('safari') > -1:
        return 'safari'
      default:
        return 'other'
    }
  }

  fullBrowserData() {
    this.broData = window.navigator.userAgent.toLowerCase()
  }

  getIPAddress() {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip
    })
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude
        const latitude = position.coords.latitude
        this.callApi(longitude, latitude)
      })
    } else {
      console.log('No support for geolocation')
    }
  }

  callApi(Longitude: number, Latitude: number) {
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${Longitude}&lat=${Latitude}`
  }

  loginDealer() {
    this.loginText = false
    this.loginLoader = true
    this.postData
      .httpPostRequest('/admin-login', this.login)
      .then((result: any) => {
        console.log(result)
        this.loginLoader = false
        this.loginText = true
        if (result.status) {
          this.toastr.success(`welcome ${result.data.admin.name}`, 'Successful')

          let token = result.token.original.access_token
          let adminData = result.data.admin
          this.tokenStorage.save(adminData, token)
          if ((adminData.role = '1')) {
            this.router.navigate(['/admin/dashboard'])
          } else if ((adminData.role = '2')) {
            this.router.navigate(['/branch/dashboard'])
          } else if ((adminData.role = '5')) {
            this.router.navigate(['/branch/dashboard'])
          } else {
            this.router.navigate(['/branch/dashboard'])
          }

          // this.location = result.data.dealer.location
          // this.dealer = result.data.dealer.id
          //  this.callLogger()
          this.router.navigate(['/admin/dashboard'])
        } else {
          this.toastr.error('Something went wrong', `${result.message}`)
        }
      })
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong')
      })
  }
}
