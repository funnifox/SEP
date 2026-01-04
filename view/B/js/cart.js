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
            toastAlert('Item not added to cart, not enough quantity available.', failed);
            return; 
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

                            // Fail
                            toastAlert('Item not added to cart, not enough quantity available.', failed);
                            allOk = false;
                            break;
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

                // Success 
                toastAlert('Add to Cart successfully!', success)
            }
        }
    }).catch(function(error) {
        console.log(error);
    });
}

const success = 'success';
const failed = 'failed';
function toastAlert(message, status) {
    toast = document.getElementById('toast');

    toast.className = 'status-toast';
    toast.innerHTML = `<span class = "message">${message}</span>`;

    if (status === success) {
        toast.classList.add('success');
    } else if (status === failed) {
        toast.classList.add('error');
    }

    toast.classList.add('show');
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 10000);

}