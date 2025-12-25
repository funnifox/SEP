let param1="showroomId"


// url param reader
// https://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery

function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

var countryId = localStorage.getItem('countryId');
function getFurniture(arr){
    console.log(arr);

    let furnitureHTML = '';
    for (let i = 0; i < arr.length; i++) {
        furnitureHTML += `
        <div class="furniture-item">
            <b>${arr[i].NAME}</b><br>
            <img src="${arr[i].IMAGEURL}" alt="${arr[i].NAME}" style="height:8rem;"><br>
            <button class="btn-delete btn" style="width:100%;" data-id="${arr[i].ID}"><i class="fas fa-trash"></i> Delete</button>
        </div>
        
            `
    }


    furnitureHTML += `
        <div class="furniture-item add-furniture" style="background-color: transparent;">
            <button class="popup-btn"><i class="fas fa-plus-circle"></i></button>
        </div>
`
    document.getElementById('furniture-list').innerHTML = furnitureHTML;
    
} 


/// no you cant add a kit kat to the showroom.
function add(furnitureName){
    let staff = JSON.parse(sessionStorage.getItem("staff"))
    const data = {
        staffId: parseInt(staff.id),
        furnitureName: furnitureName
    }

    fetch(`/api/addShowroomFurniture/${GetURLParameter(param1)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        location.reload();
        return response.json();
    }).catch(function(error) {
        console.log(error);
    });
}

// get single item by sku (country id is not needed but nice to have)
// fetch(`/api/getFurnitureBySku?sku=${arr[i].SKU}&countryId=${countryId}`, {
//     method: 'GET',
// }).then(function (response) {
//     return response.json();
// }).then(function (product) {
//     console.log(product);
// }).catch(function(error) {
//     console.log(error);
// });



function openPopup() {document.getElementById("popup").style.display = "block";}
function closePopup() {document.getElementById("popup").style.display = "none";}
// Close popup if user clicks outside the content box
window.onclick = function(event) {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};




document.addEventListener('DOMContentLoaded', function () {
    
    fetch(`/api/getShowroomById/${GetURLParameter(param1)}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        getFurniture(data.furniture)
        const img = document.getElementById("showroom-img");

        img.src = `${data.showroom.cover_image_url}`;
        img.alt = data.showroom.cover_image_url;

        
    })
    .catch(err => {
        console.error(err);
        alert('Failed to load showroom');
    });





});







// assign btns
// doing it like this instead of onclick="del()" for scalability
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        del(id);
    }

    if (e.target.classList.contains("btn-add")) {
        event.preventDefault();
        add(document.getElementById("furniture-name").value);
    }

    if (e.target.classList.contains("popup-btn")) {
        openPopup()
    }
});

