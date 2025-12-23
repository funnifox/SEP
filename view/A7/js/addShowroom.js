document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('addForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('input[name="name"]').value.trim();
        const description = form.querySelector('input[name="description"]').value.trim();
        const categoryId = form.querySelector('select[name="categoryId"]').value;
        const coverImage = form.querySelector('input[name="coverImage"]').value.trim();

        // Validation
        if (!name || !description || !categoryId || !coverImage) {
            alert('Please fill in all fields');
            return;
        }


        // bc multer doesnt work well w json parser, 
        // removed jsonParser from cont and now using formdata to pass the data
        const fileInput = document.getElementById("coverImage");

        if (!fileInput.files[0]) {
            alert("Please select a cover image!");
            return;
        }


        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("coverImage", fileInput.files[0]);


        console.log(formData)

        fetch('/api/addShowroom', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Showroom added successfully!');
                form.reset();
                window.location.href = 'showroomManagement.html';
            } else {
                alert(data.message || 'Failed to add showroom');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Server error');
        });
    });

});
