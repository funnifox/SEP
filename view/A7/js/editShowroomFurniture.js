


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
















document.addEventListener('DOMContentLoaded', function () {
    
    let param1="showroomId"
    fetch(`/api/getShowroomById/${GetURLParameter(param1)}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        const img = document.getElementById("showroom-img");

        img.src = `${data[0].cover_image_url}`;
        img.alt = data[0].cover_image_url;

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
});

