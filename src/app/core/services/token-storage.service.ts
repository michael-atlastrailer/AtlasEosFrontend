import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  static getBranch(): any {
    throw new Error('Method not implemented.')
  }
  constructor() {}

  public storeSocketId(socketId: string) {
    window.localStorage.setItem('socketid', socketId)
  }

  setVendorSwitchState(state: number) {
    if (state == 1) {
      let userData = this.getUser()
      userData.switch_state = 1
      window.localStorage.setItem('user', JSON.stringify(userData))
    } else {
      let userData = this.getUser()
      userData.switch_state = 0
      window.localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  switchBackToDefault() {
    // let dealerShipCode = this.getUser().account_id
    // let dealerShipName = this.getUser().company_name
    let dealerCode = window.localStorage.getItem('dealershipCode')
    let dealerName = window.localStorage.getItem('dealershipName')
    let location = window.localStorage.getItem('location')

    let userData = this.getUser()
    userData.account_id = dealerCode
    userData.company_name = dealerName
    userData.dealer_name = dealerName

    userData.location = location

    window.localStorage.removeItem('switchType')
    window.localStorage.removeItem('dealershipCode')
    window.localStorage.removeItem('dealershipName')
    window.localStorage.removeItem('location')

    window.localStorage.setItem('user', JSON.stringify(userData))
    // window.location.reload()
    // window.location.href = '/dealers/dashboard'

    setTimeout(() => {
      window.location.href = '/dealers/dashboard'
    }, 1000)
  }

  switchDealerToDealer(data: any) {
    if (window.localStorage.getItem('switchType')) {
      let incomingCode = data.dealer_code
      let incomingName = data.dealer_name
      let location = data.location

      let userData = this.getUser()
      userData.account_id = incomingCode
      userData.dealer_code = incomingCode
      userData.location = location

      userData.company_name = incomingName
      userData.dealer_name = incomingName
      window.localStorage.setItem('user', JSON.stringify(userData))
      // window.location.reload()
      setTimeout(() => {
        window.location.href = '/dealers/dashboard'
      }, 1000)
    } else {
      console.log('no switch type has happened')
      // window.localStorage.setItem('default', JSON.stringify(data))
      window.localStorage.setItem('switchType', 'default-to-dealer')
      let dealerShipCode = this.getUser().account_id
      let dealerShipName = this.getUser().company_name
      let location = this.getUser().location

      window.localStorage.setItem('dealershipCode', dealerShipCode)
      window.localStorage.setItem('dealershipName', dealerShipName)
      window.localStorage.setItem('location', location)

      let incomingCode = data.dealer_code
      let incomingName = data.dealer_name
      let locationIn = data.location

      let userData = this.getUser()
      userData.account_id = incomingCode
      userData.dealer_code = incomingCode
      userData.location = locationIn

      userData.company_name = incomingName
      userData.dealer_name = incomingName

      window.localStorage.setItem('user', JSON.stringify(userData))
      // window.location.reload()
      setTimeout(() => {
        window.location.href = '/dealers/dashboard'
      }, 1000)
    }
  }

  switchFromVendorToDealer(data: any) {
    window.localStorage.setItem('dealerData', JSON.stringify(data))
    window.localStorage.setItem('switchType', 'vendor-to-dealer')

    let vendorCode = this.getUser().vendor_code
    window.localStorage.setItem('vendor', vendorCode)

    let dealerCode = data.dealer_code
    let location = data.location
    let dealerName = data.dealer_name

    let userData = this.getUser()
    userData.dealer_code = dealerCode
    userData.account_id = dealerCode

    userData.company_name = dealerName
    userData.dealer_name = dealerName

    userData.location = location

    /// window.localStorage.removeItem('user')
    window.localStorage.setItem('user', JSON.stringify(userData))
  }

  switchFromDealerToVendor() {
    window.localStorage.setItem('switchType', 'dealer-to-vendor')
    window.localStorage.removeItem('dealerData')
    let userData = this.getUser()
    userData.dealer_code = null
    userData.account_id = null

    window.localStorage.removeItem('vendor')
    window.localStorage.setItem('user', JSON.stringify(userData))
  }

  checkSwitch() {
    const switchType = localStorage.getItem('switchType')
    return switchType !== null ? true : false
  }

  getSwitchType() {
    const switchType = localStorage.getItem('switchType')
    return switchType
  }

  public getSocketId() {
    const socketId = window.localStorage.getItem('socketid')
    if (socketId) {
      return socketId
    }
    return ''
  }

  public getToken(): string | null {
    return window.localStorage.getItem('token')
  }

  public save(data: any, token: any): void {
    window.localStorage.removeItem('user')
    window.localStorage.setItem('user', JSON.stringify(data))
    window.localStorage.setItem('token', token)

    // window.localStorage.removeItem('token');
    // if (data.admin) {
    //   window.localStorage.setItem('admin', JSON.stringify(data.admin));
    // }

    // if (data.dealer) {
    //             window.localStorage.setItem(
    //               'dealer',
    //               JSON.stringify(data.dealer)
    //             );

    // }
  }

  updateStoreUser(dealer: any) {
    window.localStorage.removeItem('dealer')
    window.localStorage.setItem('dealer', JSON.stringify(dealer))
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    return user !== null && token !== null ? true : false
  }

  signOut(): void {
    window.localStorage.clear()
    window.localStorage.removeItem('switchType')
    window.localStorage.removeItem('dealershipCode')
    window.localStorage.removeItem('dealershipName')
    // window.localStorage.removeItem('')
  }

  getUser() {
    const dealer = window.localStorage.getItem('user')
    if (dealer) {
      return JSON.parse(dealer)
    }
    return {}
  }

  public permissions() {
    const permissions = window.localStorage.getItem('permissions')
    if (permissions) {
      return JSON.parse(permissions)
    }
    return {}
  }
}
