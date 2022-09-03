import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute, Router } from '@angular/router'

declare var $: any

@Component({
  selector: 'app-edit-seminar',
  templateUrl: './edit-seminar.component.html',
  styleUrls: ['./edit-seminar.component.scss'],
})
export class EditSeminarComponent implements OnInit {
  seminarForm!: FormGroup
  manualChecker = false
  saveBtnStatus = true

  allVendor: any

  saveVendorCode!: string
  selectedStartTime = ''
  selectedEndTime = ''
  seminarId = ''
  currentSeminarData: any

  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  // defaultValue = { hour: 13, minute: 30 }

  // timeChangeHandler(event: Event) {
  //   console.log(event)
  // }

  // invalidInputHandler() {
  //   // some error handling
  // }

  ngOnInit(): void {
    this.buildProductForm()
    this.getVendors()

    this.route.params.subscribe((params) => {
      this.seminarId = params['id']
      this.getCurrentSeminar()
    })
  }

  getCurrentSeminar() {
    this.postData
      .httpGetRequest('/admin/get-seminar-id/' + this.seminarId)
      .then((result: any) => {
        console.log(result)

        if (result.status) {
          this.currentSeminarData = result.data

          this.selectedStartTime = result.data.start_time
          this.selectedEndTime = result.data.stop_time
          this.saveVendorCode = result.data.vendor_id

          this.seminarForm = this.fb.group({
            topic: [result.data.topic],
            join_link: [result.data.link],
            start_time: [''],
            stop_time: [''],
            seminar_date: [result.data.seminar_date],
            vendor_name: [result.data.vendor_name],
            completed_seminar_link: [''],
            seminar_id: [result.data.vendor_id],
            status: ['', Validators.required],
          })
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }

  timeChangeHandler(data: any) {
    console.log(data._formattedValueString)
    if (data._id == 'startTimePicker') {
      this.selectedStartTime = data._formattedValueString
    }

    if (data._id == 'endtimePicker') {
      this.selectedEndTime = data._formattedValueString
    }

    console.log(data)
  }

  assignVendor(data: any) {
    console.log(data.value)
    for (let index = 0; index < this.allVendor.length; index++) {
      const vendor = this.allVendor[index]
      if (vendor.vendor_name == data.value) {
        this.seminarForm.value.vendor_id = vendor.vendor_code
        this.saveVendorCode = vendor.vendor_code
        this.seminarForm.value.vendor_name = vendor.vendor_name
      }
    }
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

  submit() {
    this.seminarForm.value.seminar_id = this.currentSeminarData.id

    this.seminarForm.value.start_time =
      this.seminarForm.value.start_time == ''
        ? this.currentSeminarData.start_time
        : this.selectedStartTime

    this.seminarForm.value.stop_time =
      this.seminarForm.value.stop_time == ''
        ? this.currentSeminarData.stop_time
        : this.selectedEndTime

    /// console.log(this.seminarForm.value)

    if (this.seminarForm.status == 'VALID') {
      this.manualChecker = false
      this.saveBtnStatus = false

      this.seminarForm.value.vendor_id = this.saveVendorCode
      // this.seminarForm.value.startT]ime = this.selectedStartTime
      // this.seminarForm.value.stopTime = this.selectedEndTime
      this.seminarForm.value.id = this.seminarId

      this.postData
        .httpPostRequest('/edit-seminar', this.seminarForm.value)
        .then((result: any) => {
          this.saveBtnStatus = true
          if (result.status) {
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
    this.seminarForm.reset()
  }

  get productFormControls() {
    return this.seminarForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'topic' &&
      this.productFormControls.topic.hasError('required')
    ) {
      return 'enter seminar topic'
    } else if (
      instance === 'vendorName' &&
      this.productFormControls.vendorName.hasError('required')
    ) {
      return 'select the vendor'
    } else if (
      instance === 'startTime' &&
      this.productFormControls.startTime.hasError('required')
    ) {
      return 'select the start time'
    } else if (
      instance === 'stopTime' &&
      this.productFormControls.stopTime.hasError('required')
    ) {
      return 'select the stop time'
    } else if (
      instance === 'seminarDate' &&
      this.productFormControls.seminarDate.hasError('required')
    ) {
      return 'select the seminar date'
    } else if (
      instance === 'link' &&
      this.productFormControls.link.hasError('required')
    ) {
      return 'enter the link'
    } else if (
      instance === 'status' &&
      this.productFormControls.status.hasError('required')
    ) {
      return 'select the status'
    } else {
      return
    }
  }

  buildProductForm(): void {
    this.seminarForm = this.fb.group({
      topic: [''],
      join_link: [''],
      start_time: [''],
      stop_time: [''],
      seminar_date: [''],
      vendor_name: [''],
      completed_seminar_link: [''],
      seminar_id: [''],
      status: ['', Validators.required],
    })
  }
}
