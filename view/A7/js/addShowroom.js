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

        fetch('/api/addShowroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                categoryId: categoryId,
                coverImage: coverImage
            })
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