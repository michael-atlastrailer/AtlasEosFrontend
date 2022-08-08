import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'

declare var $: any

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup
  manualChecker = false
  saveBtnStatus = true

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
    this.buildProductForm()
    this.browserName = this.detectBrowserName()
  }

  getNormalProductTemplate() {
    $('#normal-product-template').table2csv({
      filename: 'normal-product-template',
    })
  }

  getAssortedProductTemplate() {
    $('#extra-product-template').table2csv({
      filename: 'extra-product-template',
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
      .uploadFile('/upload-product-csv', fd)
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

  submit() {
    if (this.productForm.status == 'VALID') {
      this.manualChecker = false
      this.saveBtnStatus = false

      this.postData
        .httpPostRequest('/add-product', this.productForm.value)
        .then((result: any) => {
          this.saveBtnStatus = true
          if (result.status) {
            this.productForm.reset()
            this.toastr.success(result.message, `Successful`)
          } else {
            this.toastr.error(result.message, 'Try again')
          }
        })
        .catch((err) => {
          this.saveBtnStatus = true

          this.toastr.error('Try again', 'Something went wrong')
        })
    } else {
      this.manualChecker = true
    }
  }

  resetForm() {
    this.productForm.reset()
  }

  get productFormControls() {
    return this.productForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'vendorAccount' &&
      this.productFormControls.vendorAccount.hasError('required')
    ) {
      return 'enter vendor account code'
    } else if (
      instance === 'atlasId' &&
      this.productFormControls.atlasId.hasError('required')
    ) {
      return 'enter atlas ID'
    } else if (
      instance === 'vendorItemId' &&
      this.productFormControls.vendorItemId.hasError('required')
    ) {
      return 'enter vendor item ID'
    } else if (
      instance === 'description' &&
      this.productFormControls.description.hasError('required')
    ) {
      return 'enter description'
    } else if (
      instance === 'regular' &&
      this.productFormControls.regular.hasError('required')
    ) {
      return 'enter the regular price'
    } else if (
      instance === 'special' &&
      this.productFormControls.special.hasError('required')
    ) {
      return 'enter the special price'
    } else {
      return
    }
  }

  buildProductForm(): void {
    this.productForm = this.fb.group({
      vendorAccount: ['', [Validators.required]],
      atlasId: ['', [Validators.required]],
      vendorItemId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      regular: ['', [Validators.required]],
      special: ['', [Validators.required]],
    })
  }
}
