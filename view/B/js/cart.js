// Reference area to add to cart 
function addToCart(sku,id,price,name,imageURL) {
    fetch(new Request('/api/getItemQuantity?sku=' + sku + '&storeId=-1',
    {
        method: 'GET'
    })).then(function (response) {
        return response.json();
    }).then(function (data) {
        var quantity = data[0].sum;
        //if there is not enough quantity for a product to be added to the cart
        if(quantity == null || quantity == '') {
            var url = window.location.origin + window.location.pathname;
            window.location.href = url + '?cat=' + encodeURIComponent(cat) + '&errMsg=Item not added to cart, not enough quantity available.';
        }
        else {
            var allOk = true;
            var shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
            //if shopping cart is empty
            if(shoppingCart == null || shoppingCart == '') {
                shoppingCart = [];
                shoppingCart.push({
                    id: id,
                    sku: sku,
                    price: price,
                    name: name,
                    imgURL: imageURL,
                    quantity: 1
                });
            }
            else {
                var exist = false;
                for(i = 0; i < shoppingCart.length; i++) {
                    var cartItem = shoppingCart[i];
                    //if item already exists in the cart, add 1 to the quantity
                    if(cartItem.sku == sku) {
                        if (shoppingCart[i].quantity == quantity) {
                            var url = window.location.origin + window.location.pathname;
                            window.location.href = url + '?cat=' + encodeURIComponent(cat) + '&errMsg=Item not added to cart, not enough quantity available.';
                            exist = true;
                            allOk = false;
                        }
                        else {
                            shoppingCart[i].quantity += 1;
                            exist = true;
                        }
                    }
                }
                //if item is new in the cart
                if (!exist) {
                    shoppingCart.push({
                        id: id,
                        sku: sku,
                        price: price,
                        name: name,
                        imgURL: imageURL,
                        quantity: 1
                    });
                }
            }
            if (allOk) {
                sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
                var url = window.location.origin + window.location.pathname;
                window.location.href = url + '?cat=' + encodeURIComponent(cat) + '&goodMsg=Successfully added!';
            }
        }
    }).catch(function(error) {
        console.log(error);
    });
}

