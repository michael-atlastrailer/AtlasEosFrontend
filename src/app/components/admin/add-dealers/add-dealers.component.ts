import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { AddDealer } from 'src/app/core/model/add-dealer'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'

declare var $: any

@Component({
  selector: 'app-add-dealers',
  templateUrl: './add-dealers.component.html',
  styleUrls: ['./add-dealers.component.scss'],
})
export class AddDealersComponent implements OnInit {
  dealer = new AddDealer('', '', '', '', '', '', '0')

  step1 = true
  step2 = false
  firstNameStatus = false
  lastNameStatus = false
  locationStatus = false
  phoneStatus = false
  dealerForm!: FormGroup
  manualChecker = false
  btnLoader = false
  btnText = true

  uploadCsvSendBtn = false
  setCsvBtn = true
  csvDataFile: any
  csvBtnLoader = false
  csvBtnText = true

  @ViewChild('fileCsv') csvFile!: ElementRef

  imgURL!: any

  imgUploadStatus = false

  PreviewImg = false
  dummyImg = true
  productForm!: FormGroup
  csvForm!: FormGroup

  imgStatus = false
  imgFileCount = false
  browserName = ''

  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.buildDealerForm()
    this.browserName = this.detectBrowserName()
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge'
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera'
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome'
      case agent.indexOf('trident') > -1:
        return 'ie'
      case agent.indexOf('firefox') > -1:
        return 'firefox'
      case agent.indexOf('safari') > -1:
        return 'safari'
      default:
        return 'other'
    }
  }

  exportTemplate() {
    $('#vendor-template').table2csv({
      filename: 'dealer-user-template.csv',
    })
  }

  SubmitDealer() {}

  callUploadInput() {
    this.csvFile.nativeElement.click()
  }

  fileCsvUpload(files: any) {
    if (files.length === 0) return
    var mimeType = files[0].type

    switch (this.browserName) {
      case 'firefox':
        if (mimeType !== 'application/vnd.ms-excel') {
          this.toastr.error(
            'File type not supported, upload a CSV file',
            `Upload Error`,
          )
          return
        }

        break
      case 'chrome':
        if (mimeType !== 'text/csv') {
          this.toastr.error(
            'File type not supported, upload a CSV file',
            `Upload Error`,
          )
          return
        }

        break

      default:
        if (mimeType !== 'application/vnd.ms-excel') {
          this.toastr.error(
            'File type not supported, upload a CSV file',
            `Upload Error`,
          )
          return
        }

        break
    }

    this.uploadCsvSendBtn = true
    this.setCsvBtn = false
    this.csvDataFile = files
  }

  uploadCsvServer() {
    this.csvBtnLoader = true
    this.csvBtnText = false

    let fd = new FormData()
    fd.append('csv', this.csvDataFile[0])

    this.postData
      .uploadFile('/upload-dealer-users', fd)
      .then((result) => {
        this.csvBtnLoader = false
        this.csvBtnText = true

        if (result.status) {
          this.dummyImg = true
          this.PreviewImg = false
          this.imgURL = ''
          this.setCsvBtn = true
          this.uploadCsvSendBtn = false

          this.toastr.success('Csv File Uploaded successfully', `Success`)
        } else {
          this.toastr.error('Somethin went wrong, Try again', `Uploading Error`)
        }
      })
      .catch((err) => {
        this.csvBtnLoader = false
        this.csvBtnText = true

        this.toastr.error('Somethin went wrong, Try again', `Uploading Error`)
      })
  }

  checkStepOne() {
    this.step1 = false
    this.step2 = true
  }

  Previous() {
    this.step1 = true
    this.step2 = false
  }

  buildDealerForm(): void {
    this.dealerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      accountId: ['', [Validators.required]],
      companyName: ['', [Validators.required]],

      privilegedVendors: [''],
    })
  }

  submit() {
    console.log(this.dealerForm)

    if (this.dealerForm.status == 'VALID') {
      console.log(this.dealerForm.value)
      this.btnText = false
      this.btnLoader = true
      this.postData
        .httpPostRequest('/register-dealer-users', this.dealerForm.value)
        .then((result: any) => {
          console.log(result)
          this.btnText = true
          this.btnLoader = false

          if (result.status) {
            this.step1 = true
            this.step2 = false
            this.dealerForm.reset()
            this.toastr.success(
              'Dealer Added Successful',
              `New Dealer has been added`,
            )
          } else {
            this.toastr.error(result.message, 'Try again')
          }
        })
        .catch((err) => {
          this.btnText = true
          this.btnLoader = false
          this.toastr.error('Try again', 'Something went wrong')
        })
    } else {
      this.manualChecker = true
      this.toastr.error(
        'An input field has not been filled',
        'Empty Input Field',
      )
    }
  }

  get dealerFormControls() {
    return this.dealerForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'firstName' &&
      this.dealerFormControls.firstName.hasError('required')
    ) {
      return 'enter first name'
    } else if (
      instance === 'lastName' &&
      this.dealerFormControls.lastName.hasError('required')
    ) {
      return 'enter last name'
    } else if (
      instance === 'phone' &&
      this.dealerFormControls.phone.hasError('required')
    ) {
      return 'enter phone number'
    } else if (
      instance === 'accountId' &&
      this.dealerFormControls.accountId.hasError('required')
    ) {
      return 'enter account id'
    } else if (
      instance === 'location' &&
      this.dealerFormControls.location.hasError('required')
    ) {
      return 'Choose Location'
    } else if (
      instance === 'companyName' &&
      this.dealerFormControls.companyName.hasError('required')
    ) {
      return 'Enter company name'
    } else if (
      instance === 'password' &&
      this.dealerFormControls.password.hasError('required')
    ) {
      return 'Please enter your password'
    } else if (
      instance === 'email' &&
      this.dealerFormControls.email.hasError('required')
    ) {
      return 'Enter email address'
    } else if (
      instance === 'email' &&
      this.dealerFormControls.email.hasError('email')
    ) {
      return 'Enter a valid email address'
    } else {
      return
    }
  }
}
