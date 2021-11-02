const arrayIsInvalid = (arr) => {
    return !arr || arr.length === 0;
}

export const splitCartQuantity = (list) => {
    const retList = [];
    list.forEach(l => {
        let { quantity } = l;
        if (quantity > 1) {
            while (quantity > 1) {
                l.quantity = 1;
                retList.push(l);
                quantity--;
            }
        }
        retList.push(l);
    })
    return retList;
}

export const getCartProductQualityMap = (targetList) => {
    if (arrayIsInvalid(targetList)) return null;
    return targetList.reduce((prev, item) => {
        if (item.selected && item.sku.product.onShelves && item.sku.inventory > 0) {
            const code = item.sku.code;
            const quantity = item.quantity;
            if (prev.hasOwnProperty(code)) {
                prev[code] += quantity;
            } else {
                prev[code] = quantity;
            }
        }
        return prev;
    }, {});
}


export const getOrderLineProductQualityMap = (targetList) => {
    if (arrayIsInvalid(targetList)) return null;
    return targetList.reduce((prev, item) => {
        const code = item.skuCode;
        const quantity = item.quantity;
        if (prev.hasOwnProperty(code)) {
            console.log(quantity);
            prev[code].quantity += quantity;
        } else {
            prev[code] = item;
        }
        return prev;
    }, {});
}


export const findArrayFirstItemIndex = (targetList, itemValue) => {
    let targetIndex = -1;
    if (arrayIsInvalid(targetList)) return targetIndex;
    for (var i = 0; i <= targetList.length; i++) { 
        if (targetList[i] === itemValue) {  
            targetIndex = i; 
            break; 
        } 
    }
    return targetIndex;
}