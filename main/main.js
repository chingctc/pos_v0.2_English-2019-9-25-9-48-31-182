'use strict';

function printReceipt(inputs) {
  let buyItemList = getPurchasedItemList(inputs);
  let purchasedGoodsList = getDetailedPurchasedItemList(buyItemList);
  let purchasedGoodsWithPriceList = calculateSubTotalPrice(purchasedGoodsList);
  let receiptObject = calculateReceiptTotalPrice(purchasedGoodsWithPriceList);
  let receipt = printFullReceipt(receiptObject);
  return receipt;
}

function getPurchasedItemList(itemIds) {  // Get purchased item list -> itemID + grouped quantity
    let barcodeListWithQuantity = itemIds.map(barcode => ({ barcode, quantity: 1}));
    let result = [];
    barcodeListWithQuantity.forEach(itemfirstloop => {
        if (!result.find(element => element.barcode === itemfirstloop.barcode)) {
            let itemQuantity = 0;
            barcodeListWithQuantity.filter(item => item.barcode === itemfirstloop.barcode).forEach(itemsecondloop => {
                itemQuantity += itemsecondloop.quantity;
            });
            result.push({ barcode: itemfirstloop.barcode, quantity: itemQuantity });
        }
    });
    return result;
}

function getDetailedPurchasedItemList(purchasedGoods) { // Get detailed purchase list
    let productList = loadAllItems();
    return purchasedGoods.map(item => {
        let searchItem = productList.find(product => product.barcode === item.barcode);
        return Object.assign({}, searchItem, { quantity: item.quantity });
    })
}

function calculateSubTotalPrice(purchasedGoodsWithDetail) { // Add subtotal for each product purchased
    let goodListWithsubTotal = purchasedGoodsWithDetail.map(
      item => Object.assign({}, item, { subTotal: item.price * item.quantity })
    );
    return goodListWithsubTotal.map(item => {
      return item;
  });
}

function calculateReceiptTotalPrice(purchasedGoodsWithPrice) { // Calculate total price for receipt
  let total = 0;
  purchasedGoodsWithPrice.forEach(item => {
    total += item.subTotal;
  });
  return { buyItemList: purchasedGoodsWithPrice, total: total};
}

function printFullReceipt(priceReceipt) { // Full receipt template
    let receipt = '';
    receipt += `***<store earning no money>Receipt ***\n`;
    receipt += prepareItemInfo(priceReceipt);
    receipt += '----------------------\n';
    receipt += 'Total: ' + priceReceipt.total.toFixed(2) + ' (yuan)\n';
    receipt += '**********************';
    return receipt;
}

function prepareItemInfo(priceReceipt) {  // Prepare receipt item info
  let receipt = '';
  let multipleUnits = 's';
  priceReceipt.buyItemList.forEach(item => {
      let subTotal;
      item.unit = item.quantity > 1? item.unit + multipleUnits : item.unit;
      subTotal = item.subTotal;
      receipt += 'Name: ' + item.name + ', Quantity: ' + item.quantity 
              + ' ' + item.unit + ', Unit: ' + item.price.toFixed(2)
              + ' (yuan), Subtotal: ' + subTotal.toFixed(2) + ' (yuan)\n';
  })
  return receipt;
}