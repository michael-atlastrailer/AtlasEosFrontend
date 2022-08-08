import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { AddDealer } from 'src/app/core/model/add-dealer'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'

declare var $: any

@Component({
  selector: 'app-add-vendors',
  templateUrl: './add-vendors.component.html',
  styleUrls: ['./add-vendors.component.scss'],
})
export class AddVendorsComponent implements OnInit {
  dealer = new AddDealer('', '', '', '', '', '', '0')

  step1 = true
  step2 = false
  firstNameStatus = false
  lastNameStatus = false
  locationStatus = false
  phoneStatus = false
  vendorForm!: FormGroup
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

  downloadVendorTemplate() {
    $('#vendor-template').table2csv({
      filename: 'vendorship-template',
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
      .uploadFile('/upload-vendors', fd)
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
    this.vendorForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      vendorCode: ['', [Validators.required]],
    })
  }

  submit() {
    if (this.vendorForm.status == 'VALID') {
      console.log(this.vendorForm.value)
      this.btnText = false
      this.btnLoader = true
      this.postData
        .httpPostRequest('/register-vendors', this.vendorForm.value)
        .then((result: any) => {
          console.log(result)
          this.btnText = true
          this.btnLoader = false

          if (result.status == true) {
            this.step1 = true
            this.step2 = false
            this.vendorForm.reset()
            this.toastr.success('Successful', result.message)
          } else {
            this.toastr.error('Server Error', 'Try again')
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

  get vendorFormControls() {
    return this.vendorForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'vendorName' &&
      this.vendorFormControls.vendorName.hasError('required')
    ) {
      return 'enter vendor name'
    } else if (
      instance === 'vendorCode' &&
      this.vendorFormControls.vendorCode.hasError('required')
    ) {
      return 'enter vendor code'
    } else {
      return
    }
  }
}
