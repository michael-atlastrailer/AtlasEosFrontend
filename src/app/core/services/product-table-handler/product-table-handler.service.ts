import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductTableHandlerService {

  productData: any[] = []
  assortFilter: any[] = []
  addedItem: any = []
  allAddedItemAtlasID: string[] = []
  currentProductAmt: number = 0;
  overTotal: number = 0

  constructor(
    private currencyPipe: CurrencyPipe,
  ) { }

  initCalculationData = async (
    products: any[],
    assorted: any[],
    items: any[],
    items_id: string[],
    total: number
  ) => {
    try {
      this.productData = products;
      this.assortFilter = assorted;
      this.addedItem = items;
      this.allAddedItemAtlasID = items_id;
      this.overTotal = total;
      return true;
    } catch (e) {
      // console.log("Setting Data Error: \n", e)
      return false;
    }
  }

  runGeneralCalculations = async (products: any[]) => {
    let codeStatus = false;
    try {
      this.productData = products;
      products.forEach((product, index) => {
        const setQuantity = (product.qty === "" || !product.qty.length) ? 0 : parseInt(product.qty);
        this.runCalculation(index, setQuantity, { key: false })
      });

      codeStatus = true;
    } catch (e) {
      console.log("Calculation Error: \n", e)
    }

    return {
      status: codeStatus,
      products: this.productData,
      assorted: this.assortFilter,
      addedItems: this.addedItem,
      allAddedItemsID: this.allAddedItemAtlasID,
      currentProductAmount: this.currentProductAmt,
      productTotal: this.overTotal
    }
  }

  runSingleCalculations = async (product: any, index: number, quantity?: number) => {
    let codeStatus = false;
    try {
      const setQuantity = (quantity === undefined) ? product.qty : quantity;
      // console.log(setQuantity, index)
      await this.runCalculation(index, setQuantity, { key: false })

      codeStatus = true;
    } catch (e) {
      // console.log("Calculation Error: \n", e)
    }

    return {
      status: codeStatus,
      products: this.productData,
      assorted: this.assortFilter,
      addedItems: this.addedItem,
      allAddedItemsID: this.allAddedItemAtlasID,
      currentProductAmount: this.currentProductAmt,
      productTotal: this.overTotal
    }
  }


  /**
  * Updates the Product with the specified index.
  *
  * @param {number} index The index number position of the product.
  * @param {number} amount The amount calculated as quantity * price.
  * @param {number} price The selected price for product calculation (normal, special, assorted).
  * @param {string|null} spec The is the index point to specify what offer was uses from the spec_data eg: (`0` meaning normal price used) or (`0-1` meaning the 2nd price was used from the spec_data) .
  * @return {any} returns the new value after being assigned.
  */
  assignSalesValue = (
    index: number,
    quantity: number | string,
    amount: number,
    price: number,
    spec: string | null,
  ) => {
    // update each unique element
    this.productData[index].qty = (quantity !== 0) ? String(quantity) : ''
    this.productData[index].selected_spec = spec
    this.productData[index].forCal = amount
    this.productData[index].calPrice = amount
    this.productData[index].unitPrice = price
    this.productData[index].price = amount

    this.currentProductAmt = amount

    // console.log(this.productData[index])
    return this.productData[index]
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {any} current The current product.
   * @return {void}.
   */
  updateOtherAssorted = (current: any) => {
    let totalQuantity = this.getTotalAssortedQuantity(current)
    this.assortFilter = this.assortFilter.map((ass: any) => {
      // console.log(ass, 'checking asses')
      // if (ass.qty != '' || ass.qty > 0) {
      let update_ass = ass
      let price = parseFloat(ass.booking)
      let calAmt = parseInt(ass.qty) * price
      let selected_spec = `${ass.position}`

      ass.spec_data.map((sp: any, af_index: number) => {
        let curAmt = parseFloat(sp.special)
        if (totalQuantity >= parseInt(sp.cond)) {
          price = curAmt
          calAmt = parseInt(ass.qty) * price
          selected_spec = `${ass.position}-${af_index}`
        }
      })

      let curQty = (ass.qty === 0) ? '' : ass.qty
      // const curQty = (ass.qty === "" || !ass.qty.length) ? '' : parseInt(ass.qty);


      if (curQty) {
        update_ass = this.assignSalesValue(
          ass.position,
          curQty,
          calAmt,
          price,
          selected_spec,
        )
      }

      // update record in assortFilter
      // }
      if (typeof update_ass === 'object') return update_ass
    })
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {any} current The current product.
   * @return {number} returns total assorted quantity.
   */
  getTotalAssortedQuantity = (current: any) => {
    let totalQuantity = this.assortFilter.reduce(
      (accumulate: number, af: any) => {
        // const newQuantity = (current.grouping === af.grouping) ? parseInt(af.qty) : 0;
        const setQty = (af.qty === "" || !af.qty.length) ? 0 : parseInt(af.qty);
        const newQuantity = current.grouping ? setQty : 0
        // console.log(af, accumulate, newQuantity )
        return accumulate + newQuantity
      },
      0,
    )

    return totalQuantity
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {any} prc The current product.
   * @return {boolean} returns true/false if section price has been selected.
   */
  checkSpecials(prc: any, curIndex?: number) {
    // console.log(prc);
    let check = false
    if (prc?.selected_spec) {
      // console.log(prc?.selected_spec);
      if (Number.isInteger(curIndex)) {
        check = `${prc.position}-${curIndex}` === prc?.selected_spec
      } else {
        check = `${prc.position}` === prc?.selected_spec
      }
    }

    return check
  }

  runCalculation = async (index: number, qty: number, event: any) => {
    if (event.key != 'Tab') {
      let curr = this.productData[index]
      let atlasId = curr.atlas_id
      let spec = curr.spec_data
      curr.qty = qty ?? ''
      // console.log(curr);

      if (qty) {
        // calculate default prices
        let price = parseFloat(curr.booking)
        let calAmt = qty * price
        let selected_spec = curr.selected_spec ?? `${index}`

        if (!this.allAddedItemAtlasID.includes(atlasId))
          this.allAddedItemAtlasID.push(atlasId)

        // console.log(curr);
        if (spec && spec.length) {
          // search through offers
          spec.map((sp: any, af_index: number) => {
            let curAmt = parseFloat(sp.special)
            let cond = parseInt(sp.cond)

            if (sp.type === 'assorted') {
              // add curr product as assorted if has assorted specials
              const assortIds = this.assortFilter.map(
                (ass: any) => ass.atlas_id,
              )
              if (!assortIds.includes(curr.atlas_id)) {
                curr.qty = String(qty)
                this.assortFilter.push(curr)
                // get total quantity of assorted
              }

              let totalQuantity = this.getTotalAssortedQuantity(curr)
              // console.log(totalQuantity, this.assortFilter);
              if (totalQuantity >= cond) {
                price = curAmt
                calAmt = qty * price
                selected_spec = `${index}-${af_index}`

                // run update on all assorted product sale value
              }
              console.log(this.assortFilter, totalQuantity, cond, selected_spec)

              this.updateOtherAssorted(curr)

            } else if (sp.type === 'special') {
              ///////// Special Price ////////
              if (qty >= cond) {
                price = curAmt
                calAmt = qty * price
                selected_spec = `${index}-${af_index}`
              }
            }
            // update product sale value
            curr = this.assignSalesValue(
              index,
              qty,
              calAmt,
              price,
              selected_spec,
            )
          })
        } else {
          // update product sale value
          curr = this.assignSalesValue(index, qty, calAmt, price, selected_spec)
        }
      } else {
        // update product sale value
        curr = this.assignSalesValue(index, 0, 0, 0, null)
        // console.log(curr)
        // remove current data from assorted products
        const assortIds = this.assortFilter.map((ass: any) => ass.atlas_id)
        // run update on all assorted product sale value
        if (assortIds.includes(curr.atlas_id)) this.updateOtherAssorted(curr)
      }
    }

    this.runTotalCalculation(index)
  }

  runTotalCalculation(index: number) {
    // let currentProduct = this.productData[index]
    this.overTotal = 0

    const validProducts = this.productData.filter((product) => (product.qty != "" && product.qty.length))
    // console.log(validProducts);
    this.overTotal = validProducts.reduce((accumulator, object) => {
      return accumulator + parseFloat(object.price);
    }, 0);

  }


}


