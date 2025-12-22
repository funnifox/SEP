document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('addForm');
    const submitBtn = form.querySelector('button');

    submitBtn.addEventListener('click', function () {

        // Get values
        const name = form.querySelector('input[name="name"]').value.trim();
        const description = form.querySelector('input[name="description"]').value.trim();
        const categoryId = form.querySelector('select[name="categoryId"]').value;
        const fileInput = document.getElementById('imgfile');

        // Basic validation
        if (!name || !description || !categoryId || fileInput.files.length === 0) {
            alert('Please fill in all fields');
            return;
        }

        // FormData for multipart/form-data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('coverImage', fileInput.files[0]); // MUST match multer field name

        fetch('/api/addShowroom', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Showroom added successfully!');
                form.reset();
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
