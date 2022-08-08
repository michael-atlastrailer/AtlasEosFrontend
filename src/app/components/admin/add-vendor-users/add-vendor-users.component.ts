import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { AddDealer } from 'src/app/core/model/add-dealer'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'

declare var $: any

@Component({
  selector: 'app-add-vendor-users',
  templateUrl: './add-vendor-users.component.html',
  styleUrls: ['./add-vendor-users.component.scss'],
})
export class AddVendorUsersComponent implements OnInit {
  dealer = new AddDealer('', '', '', '', '', '', '0')

  step1 = true
  step2 = false
  firstNameStatus = false
  lastNameStatus = false
  locationStatus = false
  phoneStatus = false
  vendorUserForm!: FormGroup
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
  allVendor: any
  stateVendorName!: string

  browserName = ''
  browserVersion = ''
  selectedVendorCode = ''

  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.buildDealerForm()
    this.getVendors()
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

  downloadVendorTemplate() {
    $('#vendor-template').table2csv({
      filename: 'vendor-user-template',
    })
  }

  getVendors() {
    this.postData
      .httpGetRequest('/get-all-vendors')
      .then((result: any) => {
        console.log(result)

        if (result.status) {
          this.allVendor = result.data
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }

  SubmitDealer() {}

  assignVendor(data: any) {
    console.log(data.value)
    for (let index = 0; index < this.allVendor.length; index++) {
      const vendor = this.allVendor[index]
      if (vendor.vendor_name == data.value) {
        this.selectedVendorCode = vendor.vendor_code
        this.vendorUserForm.value.vendor = vendor.vendor_code
        this.stateVendorName = vendor.vendor_name
        this.vendorUserForm.value.vendorName = vendor.vendor_name
      }
    }
  }

  callUploadInput() {
    this.csvFile.nativeElement.click()
  }

  fileCsvUpload(files: any) {
    console.log(files)
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
      .uploadFile('/upload-vendor-users', fd)
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

  buildDealerForm(): void {
    this.vendorUserForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      vendor: ['', [Validators.required]],
      // vendorName: [''],
      privilegeVendors: [''],
      location: ['', [Validators.required]],
    })
  }

  submit() {
    console.log(this.vendorUserForm.value)
    console.log(this.vendorUserForm.status)
    if (this.vendorUserForm.status == 'VALID') {
      this.vendorUserForm.value.vendorName = this.stateVendorName
      this.vendorUserForm.value.vendor = this.selectedVendorCode
      this.btnText = false
      this.btnLoader = true
      this.postData
        .httpPostRequest('/register-vendor-users', this.vendorUserForm.value)
        .then((result: any) => {
          console.log(result)
          this.btnText = true
          this.btnLoader = false

          if (result.status) {
            this.step1 = true
            this.step2 = false
            this.vendorUserForm.reset()
            this.vendorUserForm.value.vendor = 'Select Vendor'
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
    }
  }

  get vendorUserFormControls() {
    return this.vendorUserForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'fullName' &&
      this.vendorUserFormControls.fullName.hasError('required')
    ) {
      return 'enter full name'
    }

    if (
      instance === 'email' &&
      this.vendorUserFormControls.email.hasError('required')
    ) {
      return 'enter email address'
    }

    if (
      instance === 'password' &&
      this.vendorUserFormControls.password.hasError('required')
    ) {
      return 'enter password'
    }

    if (
      instance === 'location' &&
      this.vendorUserFormControls.location.hasError('required')
    ) {
      return 'Choose vendor Location'
    }

    if (
      instance === 'password' &&
      this.vendorUserFormControls.password.hasError('required')
    ) {
      return 'Please enter your password'
    }

    if (
      instance === 'vendor' &&
      this.vendorUserFormControls.vendor.hasError('required')
    ) {
      return 'Please select the vendor'
    }

    if (
      instance === 'email' &&
      this.vendorUserFormControls.email.hasError('email')
    ) {
      return 'Enter a valid email address'
    }

    return
  }
}
