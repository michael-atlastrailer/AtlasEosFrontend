import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { AddDealer } from 'src/app/core/model/add-dealer'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-promotional-flier',
  templateUrl: './edit-promotional-flier.component.html',
  styleUrls: ['./edit-promotional-flier.component.scss'],
})
export class EditPromotionalFlierComponent implements OnInit {
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
  selectedVendorId: any
  selectedPdfName!: string
  pdfChecker = false
  pdfErrorMsg = false
  promotionalFlierId = ''
  currentPromotionalFlierData: any
  loadingText = true
  browserName = ''

  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.buildDealerForm()
    this.getVendors()
    this.browserName = this.detectBrowserName()

    this.route.params.subscribe((params) => {
      this.promotionalFlierId = params['id']
      this.getCurrentPromotionalFiler()
    })
  }

  getCurrentPromotionalFiler() {
    this.postData
      .httpGetRequest('/admin/get-promotional-flyer/' + this.promotionalFlierId)
      .then((result: any) => {
        this.loadingText = false
        if (result.status) {
          this.currentPromotionalFlierData = result.data
          this.selectedVendorId = result.data.vendor_id
          this.vendorUserForm = this.fb.group({
            name: [result.data.name, [Validators.required]],
            pdf: [''],
            image_url: [''],
            vendor: [result.data.vendor_name, Validators.required],
          })
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        this.loadingText = false

        // this.toastr.error('Try again', 'Something went wrong')
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

  assignVendor(data: any) {
    console.log(data.value)
    for (let index = 0; index < this.allVendor.length; index++) {
      const vendor = this.allVendor[index]
      if (vendor.vendor_name == data.value) {
        this.vendorUserForm.value.vendor_id = vendor.vendor_code
        this.selectedVendorId = vendor.vendor_code
      }
    }
  }

  callUploadInput() {
    this.csvFile.nativeElement.click()
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

  fileCsvUpload(files: any) {
    if (files.length === 0) return
    var mimeType = files[0].type
    console.log(mimeType)

    switch (this.browserName) {
      case 'firefox':
        if (mimeType !== 'application/pdf') {
          this.toastr.error(
            'File type not supported, upload a CSV file',
            `Upload Error`,
          )
          return
        }

        break
      case 'chrome':
        if (mimeType !== 'application/pdf') {
          this.toastr.error(
            'File type not supported, upload a CSV file',
            `Upload Error`,
          )
          return
        }

        break

      default:
        if (mimeType !== 'application/pdf') {
          this.toastr.error(
            'File type not supported, upload a CSV file',
            `Upload Error`,
          )
          return
        }

        break
    }

    // if (mimeType !== 'application/pdf') {
    //   this.toastr.error(
    //     'File type not supported, upload a PDF file',
    //     `Upload Error`,
    //   )
    //   return
    // }

    this.selectedPdfName = files[0].name
    this.pdfChecker = true
    this.csvDataFile = files
    this.pdfErrorMsg = false
  }

  uploadPromotionalFlyer() {
    if (this.vendorUserForm.status == 'VALID' && this.pdfChecker) {
      this.btnLoader = true
      this.btnText = false
      let fd = new FormData()
      fd.append('pdf', this.csvDataFile[0])
      fd.append('vendor_id', this.selectedVendorId)
      fd.append('name', this.vendorUserForm.value.name)

      console.log(fd)

      this.postData
        .uploadFile('/edit-promotional-flier/' + this.promotionalFlierId, fd)
        .then((result) => {
          this.btnLoader = false
          this.btnText = true
          if (result.status) {
            this.vendorUserForm.reset()
            this.selectedPdfName = ''

            this.toastr.success(result.message, `Success`)
          } else {
            this.toastr.error(
              'Somethin went wrong, Try again',
              `Uploading Error`,
            )
          }
        })
        .catch((err) => {
          this.csvBtnLoader = false
          this.csvBtnText = true
          this.btnLoader = false
          this.btnText = true

          this.toastr.error('Somethin went wrong, Try again', `Uploading Error`)
        })
    } else {
      this.pdfErrorMsg = true
      this.manualChecker = true
    }
  }

  buildDealerForm(): void {
    this.vendorUserForm = this.fb.group({
      name: ['', [Validators.required]],
      pdf: [''],
      image_url: [''],
      vendor: ['', Validators.required],
    })
  }

  submit() {
    console.log(this.vendorUserForm.value)
    console.log(this.vendorUserForm.status)
    if (this.vendorUserForm.status == 'VALID') {
      this.vendorUserForm.value.vendorName = this.stateVendorName
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
      instance === 'name' &&
      this.vendorUserFormControls.name.hasError('required')
    ) {
      return 'enter the name'
    }

    if (
      instance === 'vendor' &&
      this.vendorUserFormControls.vendor.hasError('required')
    ) {
      return 'select the vendor'
    }

    if (instance === 'pdf') {
      return 'select the pdf docs'
    }

    return
  }
}
