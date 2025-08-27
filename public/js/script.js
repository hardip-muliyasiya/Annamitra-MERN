
window.foodItems = window.foodItems || [];
let imagesModalURLs = [];
let imagesModalIndex = 0;
let alertTypes = {
    'Primary': 'primary',
    'Secondary': 'secondary',
    'Success': 'success',
    'Danger': 'danger',
    'Warning': 'warning',
    'Info': 'info',
};

document.addEventListener('DOMContentLoaded', () => {

    console.log('document loaded');

    //  ==========================  Login page JS  ============================

    const loginForm = document.querySelector('.login-form');
    if (loginForm) {

    }



    //  ==========================  Registration page JS  ============================

    // const form = document.querySelector('.register-form');
    const registrationForm = document.getElementById('register-form');
    if (registrationForm) {
        validateRegistrationForm(registrationForm);
    }



    //  ==========================  Donation page JS  ============================

    // Validate the donation form
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        validateDonationForm(donationForm, 'new');
    }

    const editDonationForm = document.getElementById('edit-donation-form');
    if (editDonationForm) {
        validateDonationForm(editDonationForm, 'edit');
    }

    // Add food item to the donation list in modal form
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        validateItemForm(itemForm, 'new');
    }

    // Edit food item in the donation list
    const editItemForm = document.getElementById('editItemForm');
    if (editItemForm) {
        validateItemForm(editItemForm, 'edit');
    }

    // Handle image input
    const itemImages = document.getElementById('itemImages');
    if (itemImages) {
        itemImages.addEventListener('change', handleImageUpload);
    }
    const editItemImages = document.getElementById('editItemImages');
    if (editItemImages) {
        editItemImages.addEventListener('change', handleImageUpload);
    }
    const donationImages = document.getElementById('donationImages'); // unchanged, input name is images[]
    if (donationImages) {
        donationImages.addEventListener('change', handleImageUpload);
    }

    // Table click listener for event delegation
    const itemsTable = document.getElementById('itemsTable');
    if (itemsTable) {
        itemsTable.addEventListener('click', function (event) {
            if (event.target.classList.contains('fa-trash-alt') || event.target.classList.contains('btn-outline-danger')) {
                handleDeleteFoodItem(event);
            }
            if (event.target.classList.contains('fa-pen') || event.target.classList.contains('btn-outline-primary')) {
                handleOpenEditFoodItemModal(event);
            }
            if (event.target.classList.contains('hover-blue')) {
                handleOpenImagesModal(event);
            }
        });
    }


    // Handle image modal navigation
    const viewerImage = document.getElementById('viewerImage');
    const nextImageBtn = document.getElementById('nextImage');
    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', function (event) {
            imagesModalIndex++;
            if (imagesModalIndex === imagesModalURLs.length) {
                imagesModalIndex = 0;
            }
            viewerImage.src = imagesModalURLs[imagesModalIndex];
        });
    }
    const prevImageBtn = document.getElementById('prevImage');
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', function (event) {
            imagesModalIndex--;
            if (imagesModalIndex < 0) {
                imagesModalIndex = imagesModalURLs.length - 1;
            }
            viewerImage.src = imagesModalURLs[imagesModalIndex];
        });
    }

    const viewerDonationImage = document.getElementById('viewerDonationImage');
    if (viewerDonationImage) {
        const nextDonationImageBtn = document.getElementById('nextDonationImage');
        const prevDonationImageBtn = document.getElementById('prevDonationImage');
        if (viewerDonationImages.length === 0) {
            nextDonationImageBtn.disabled = true;
            prevDonationImageBtn.disabled = true;
        }
        else {
            nextDonationImageBtn.addEventListener('click', function (event) {
                viewerDonationImagesIndex++;
                if (viewerDonationImagesIndex === viewerDonationImages.length) {
                    viewerDonationImagesIndex = 0;
                }
                viewerDonationImage.src = viewerDonationImages[viewerDonationImagesIndex];
            });

            prevDonationImageBtn.addEventListener('click', function (event) {
                viewerDonationImagesIndex--;
                if (viewerDonationImagesIndex < 0) {
                    viewerDonationImagesIndex = viewerDonationImages.length - 1;
                }
                viewerDonationImage.src = viewerDonationImages[viewerDonationImagesIndex];
            });
        }
    }

    // Handle current location button click
    const currentLocationBtn = document.getElementById('currentLocation');
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', handleGetCurrentLocation);
    }

    // Handle city input blur event to set location
    const donationCityInput = document.getElementById('donationCity');
    if (donationCityInput) {
        donationCityInput.addEventListener('blur', handleSetCityLocation);
    }

    // Handle request pickup form
    const requestDonationForm = document.getElementById('requestDonationForm');
    if (requestDonationForm) {
        validateRequestDonationForm(requestDonationForm);
    }




    //  ==========================  All Donations page JS  ============================
    const searchTitleDesc = document.getElementById('searchTitleDesc');
    if (searchTitleDesc) {
        console.log('search filters initialized');
        setDonationFilters();
    }

});




/*  ---------------------------  Handler Functions  ---------------------------  */



// Function to validate the regisitration form
function validateRegistrationForm(form) {
    console.log('Registration form found');
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const contact = document.getElementById('contact');
    const accountType = document.getElementById('account-type');
    const address = document.getElementById('address');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    const showError = (input, message) => {
        const formGroup = input.parentElement;
        input.classList.add('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.parentElement;
        input.classList.remove('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = '';
    };

    const isEmailValid = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const isPasswordSecure = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return re.test(password);
    };

    const isContactValid = (contact) => {
        // Accepts 10 digit numbers, can be improved for country codes
        return /^\d{10}$/.test(contact);
    };

    const validateForm = () => {
        let isValid = true;

        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required.');
            isValid = false;
        } else {
            showSuccess(firstName);
        }

        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required.');
            isValid = false;
        } else {
            showSuccess(lastName);
        }

        if (email.value.trim() === '') {
            showError(email, 'Email is required.');
            isValid = false;
        } else if (!isEmailValid(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        } else {
            showSuccess(email);
        }

        if (contact.value.trim() === '') {
            showError(contact, 'Contact is required.');
            isValid = false;
        } else if (!isContactValid(contact.value.trim())) {
            showError(contact, 'Please enter a valid 10-digit contact number.');
            isValid = false;
        } else {
            showSuccess(contact);
        }

        if (!accountType.value) {
            showError(accountType, 'Please select an account type.');
            isValid = false;
        } else {
            showSuccess(accountType);
        }

        if (address.value.trim() === '') {
            showError(address, 'Address is required.');
            isValid = false;
        } else if (address.value.length > 300) {
            showError(address, 'Address is too long. Maximum 300 characters allowed.');
            isValid = false;
        } else {
            showSuccess(address);
        }

        if (password.value.trim() === '') {
            showError(password, 'Password is required.');
            isValid = false;
        } else if (!isPasswordSecure(password.value)) {
            showError(password, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            isValid = false;
        } else {
            showSuccess(password);
        }

        if (confirmPassword.value.trim() === '') {
            showError(confirmPassword, 'Please confirm your password.');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match.');
            isValid = false;
        } else {
            showSuccess(confirmPassword);
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger, 'Please fix the errors in the form before submitting.');
        }
        else {
            form.submit();
        }
    });

    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}




// Function to handle the donation form submission
function validateDonationForm(donationForm, action) {
    console.log('Donation form found');

    const donationImages = donationForm.querySelector('[name="images[]"]');

    const showError = (input, message) => {
        const formGroup = input.closest('div');
        input.classList.add('input-error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.closest('div');
        input.classList.remove('input-error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = '';
    };

    const isEmailValid = email =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

    const isPhoneValid = phone => /^\d{10}$/.test(phone.trim());

    const validateForm = () => {
        let isValid = true;

        const requiredFields = [
            'title', 'source', 'numberOfPeopleFed', 'address', 'city',
            'state', 'personName', 'contact', 'email'
        ];

        requiredFields.forEach(name => {
            const input = donationForm.querySelector(`[name="${name}"]`);
            if (!input || input.disabled) return;

            if (input.value.trim() === '' || input.value === null) {
                showError(input, 'This field is required.');
                isValid = false;
            } else {
                showSuccess(input);
            }
        });

        const emailInput = donationForm.querySelector('[name="email"]');
        if (emailInput && emailInput.value && !isEmailValid(emailInput.value)) {
            showError(emailInput, 'Invalid email address.');
            isValid = false;
        }

        const phoneInput = donationForm.querySelector('[name="contact"]');
        if (phoneInput && phoneInput.value && !isPhoneValid(phoneInput.value)) {
            showError(phoneInput, 'Enter a valid 10-digit contact number.');
            isValid = false;
        }

        if (foodItems.length === 0) {
            showError(donationForm.querySelector('[name="foodItems"]'), 'At least one food item is required.');
            isValid = false;
        }

        if (donationImages && donationImages.files.length > 0 && donationImages.files.length <= 5) {
            showSuccess(donationImages);
            const invalidFiles = [...donationImages.files].filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                showError(donationImages, 'Only image files are allowed.');
                isValid = false;
            } else {
                showSuccess(donationImages);
            }
        } else if (action === 'new') {
            showError(donationImages, 'Select 1 to 5 images.');
            isValid = false;
        }

        return isValid;
    };

    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger || 'danger', 'Please fix the errors before submitting.');
        }
        else {
            submitFoodDonataionForm(e, donationForm, action); // Call the function to handle form submission
        }
    });

    donationForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}

function submitFoodDonataionForm(e, donationForm, action) {
    const formData = new FormData(donationForm);
    const donationImageFiles = donationForm.querySelector('input[name="images[]"]').files;
    let path = "";
    if (action === 'new') {
        path = "/donations/new";
    }
    else if (action === 'edit') {
        path = `/donations/${formData.get('donationId')}/edit`;
    }

    // Append each food item as nested fields
    foodItems.forEach((item, index) => {
        formData.append(`foodItems[${index}][name]`, item.name);
        formData.append(`foodItems[${index}][quantity]`, item.quantity);
        formData.append(`foodItems[${index}][unit]`, item.unit);
        formData.append(`foodItems[${index}][type]`, item.type);
        formData.append(`foodItems[${index}][condition]`, item.condition);
        formData.append(`foodItems[${index}][cookedDate]`, item.cookedDate);
        formData.append(`foodItems[${index}][cookedTime]`, item.cookedTime);
        formData.append(`foodItems[${index}][expiryDate]`, item.expiryDate);
        formData.append(`foodItems[${index}][expiryTime]`, item.expiryTime);

        // Add images for this item
        if (item.itemImageFiles && item.itemImageFiles.length > 0) {
            item.itemImageFiles.forEach((file, j) => {
                formData.append(`foodItems[${index}][itemImages][${j}]`, file);
            });
            if (action === 'edit') {
                oldItemImages[index].forEach((image, j) => {
                    formData.append(`foodItems[${index}][oldItemImages][${j}]`, image);
                });
            }
        }
        else if (action === 'edit') {
            item.itemImages.forEach((image, j) => {
                formData.append(`foodItems[${index}][itemImages][${j}]`, image);
            });
        }
    });

    if (action === 'edit') {
        if (donationImageFiles.length !== 0) {
            // If editing and new images selected, append old images if any
            const oldDonationImages = window.oldDonationImages || [];
            oldDonationImages.forEach((image, i) => {
                formData.append(`oldDonationImages[${i}]`, image);
            });
        }
        else {
            // If editing and no new images, append old images as donation images if any
            const oldDonationImages = window.oldDonationImages || [];
            oldDonationImages.forEach((image, i) => {
                formData.append(`donationImages[${i}]`, image);
            });
        }
    }

    console.log(Object.fromEntries(formData.entries()));

    // Send via fetch to your route
    fetch(path, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/donations/${data.donationId}`;
            }
            else {
                if (action === 'new') {
                    showAlert(alertTypes.Danger, data.message || 'Failed to submit donation. Please try again.');
                }
                else if (action === 'edit') {
                    showAlert(alertTypes.Danger, data.message || 'Failed to edit donation. Please try again.');
                }
            }
        })
        .catch(err => {
            if (action === 'new') {
                showAlert(alertTypes.Danger, 'Submission failed.');
            }
            else if (action === 'edit') {
                showAlert(alertTypes.Danger, 'Edit failed.');
            }
            console.error(err);
        });
}

// Function to validate the item form
function validateItemForm(form, action) {
    const name = form.querySelector('[name="name"]');
    const quantity = form.querySelector('[name="quantity"]');
    const unit = form.querySelector('[name="unit"]');
    const type = form.querySelector('[name="type"]');
    const condition = form.querySelector('[name="condition"]');
    const expiryDate = form.querySelector('[name="expiryDate"]');
    const expiryTime = form.querySelector('[name="expiryTime"]');
    const cookedDate = form.querySelector('[name="cookedDate"]');
    const cookedTime = form.querySelector('[name="cookedTime"]');
    const itemImages = form.querySelector('[name="itemImages[]"]');

    const showError = (input, message) => {
        const formGroup = input.closest('.mb-4') || input.parentElement;
        input.classList.add('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.closest('.mb-4') || input.parentElement;
        input.classList.remove('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = '';
    };

    const validateForm = () => {
        let isValid = true;

        if (!name.value.trim()) {
            showError(name, 'Item name is required.');
            isValid = false;
        } else {
            showSuccess(name);
        }

        if (!quantity.value || isNaN(quantity.value) || Number(quantity.value) <= 0) {
            showError(quantity, 'Enter a valid quantity.');
            isValid = false;
        } else {
            showSuccess(quantity);
        }

        if (!unit.value) {
            showError(unit, 'Select a unit.');
            isValid = false;
        } else {
            showSuccess(unit);
        }

        if (!type.value) {
            showError(type, 'Select a food type.');
            isValid = false;
        } else {
            showSuccess(type);
        }

        if (!condition.value) {
            showError(condition, 'Select the condition.');
            isValid = false;
        } else {
            showSuccess(condition);
        }

        if (!cookedDate.value) {
            showError(cookedDate, 'Cooked date is required.');
            isValid = false;
        } else {
            showSuccess(cookedDate);
        }

        if (!cookedTime.value) {
            showError(cookedTime, 'Cooked time is required.');
            isValid = false;
        } else {
            showSuccess(cookedTime);
        }

        // Optional but still validate format if provided
        if (expiryDate.value && !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate.value)) {
            showError(expiryDate, 'Invalid expiry date format.');
            isValid = false;
        } else {
            showSuccess(expiryDate);
        }

        if (expiryTime.value && !/^\d{2}:\d{2}$/.test(expiryTime.value)) {
            showError(expiryTime, 'Invalid expiry time format.');
            isValid = false;
        } else {
            showSuccess(expiryTime);
        }

        // Optional: file type check (image)
        if (itemImages && itemImages.files.length > 0 && itemImages.files.length <= 3) {
            showSuccess(itemImages);
            const invalidFiles = [...itemImages.files].filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                showError(itemImages, 'Only image files are allowed.');
                isValid = false;
            } else {
                showSuccess(itemImages);
            }
        } else if (action === 'new') {
            showError(itemImages, 'Select 1 to 3 images.');
            isValid = false;
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger, 'Please fix the errors in the item form.');
        } else {
            if (action === 'new') {
                handleNewFoodItem(e); // Call the handler to add the item
            }
            else if (action === 'edit') {
                handleEditFoodItem(e); // Call the handler to edit the item
            }
        }
    });

    // Re-validate on input change
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}

// Handler for adding a new food item to the donation list
function handleNewFoodItem(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    if (foodItems.length === 0) {
        itemsTable.lastElementChild.innerHTML = ''
    }

    const formData = new FormData(itemForm);
    let itemDetails = Object.fromEntries(formData.entries());
    itemDetails['itemImages'] = selectedItemImages;
    const imageFiles = itemForm.querySelector('input[name="itemImages[]"]').files;
    itemDetails.itemImageFiles = Array.from(imageFiles); // store File objects, not blob URLs
    foodItems.push(itemDetails);
    // console.log(itemDetails);

    event.target.reset(); // Reset the form after submission
    event.target.querySelector('.imagesPreview').innerHTML = ''; // Clear image previews
    selectedItemImages = []; // Clear the selected images array
    handleTableInsert(); // Update the items table with the new item
    showAlert(alertTypes.Success, 'Food item added successfully!');

    const foodItemsError = document.querySelector('input[name="foodItems"]').closest('div').querySelector('.error-message');
    if (foodItemsError) {
        foodItemsError.innerText = '';
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('new-item-modal'));
    modal.hide();
}

// Function to insert a new row in the items table
function handleTableInsert() {
    const item = foodItems[foodItems.length - 1]; // Get the last added item
    const row = document.createElement('tr');
    let expDT = `${item.expiryDate} - ${item.expiryTime}`;
    if (item.expiryDate === '' && item.expiryTime === '') {
        expDT = 'N/A';
    }
    let imgHTML = 'N/A';
    if (item.itemImages.length > 0) {
        imgHTML = `
                <div class="border rounded p-1" style="max-width: 100px;">
                    <img src="${item.itemImages[0]}" alt="food item" class="img-fluid">
                    <div class="text-center hover-blue" data-bs-toggle="modal" data-bs-target="#images-modal">View all</div>
                </div>`;
    }
    row.innerHTML = `
            <td>${foodItems.length}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.condition}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${item.cookedDate} - ${item.cookedTime}</td>
            <td>${expDT}</td>
            <td>${imgHTML}</td>
            <td class="text-center align-middle">
                <!-- Edit Button -->
                <button class="btn btn-outline-primary btn-sm me-1" type="button"
                    data-bs-toggle="modal" data-bs-target="#edit-item-modal" data-bs-placement="top" title="Edit this item">
                    <i class="fas fa-pen"></i>
                </button>

                <!-- Delete Button -->
                <button class="btn btn-outline-danger btn-sm" type="button"
                    data-bs-toggle="tooltip" data-bs-placement="top" title="Delete this item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>

        `;
    itemsTable.lastElementChild.appendChild(row);
}

// Image handler for the image input
let selectedItemImages = [];
let selectedDonationImages = [];
function handleImageUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('preview');
    fs = files;
    let imageLimit = 3;
    if (event.target === donationImages) {
        imageLimit = 5; // Maximum number of images allowed
    }

    if (files.length > imageLimit) {
        showAlert(alertTypes.Warning, `You can only select up to ${imageLimit} images.`);
        event.target.value = ''; // Reset input
        event.target.nextElementSibling.innerText = "Upload an image of the food you're donating";
        return;
    }

    const names = Array.from(files).map(file => file.name).join(', ');
    event.target.nextElementSibling.innerText = 'Selected: ' + names;
    event.target.nextElementSibling.nextElementSibling.innerHTML = ''; // Clear previous previews
    if (event.target === donationImages) {
        selectedDonationImages = [];
    }
    else {
        selectedItemImages = [];
    }
    [...files].forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        if (event.target === donationImages) {
            selectedDonationImages.push(img.src);
        }
        else {
            selectedItemImages.push(img.src);
        }
        img.className = 'img-thumbnail me-2 mb-2';
        img.style.maxWidth = '150px';
        event.target.nextElementSibling.nextElementSibling.appendChild(img);
    });
}

// Function to update the index numbers in the items table
// This is called after deleting an item
function updateIndexes() {
    const trs = itemsTable.lastElementChild.childNodes;
    for (i = 0; i < trs.length; i++) {
        trs[i].firstElementChild.innerText = i + 1;
    }
}

// Function to handle deletion of a food item from the table
function handleDeleteFoodItem(event) {
    const row = event.target.closest('tr');
    const itemIndex = row.rowIndex - 1; // Adjust for header row
    foodItems.splice(itemIndex, 1); // Remove item from array
    itemsTable.deleteRow(row.rowIndex); // Remove row from table
    updateIndexes();
    showAlert(alertTypes.Success, 'Food item deleted successfully!');
}

// Function to open edit food item model
function handleOpenEditFoodItemModal(event) {
    const row = event.target.closest('tr');
    const itemIndex = row.rowIndex - 1; // Adjust for header row
    let item = foodItems[itemIndex]; // Get the item to edit

    // Get the form
    const form = document.getElementById('editItemForm');

    // Fill the input fields
    form.elements['name'].value = item.name || '';
    form.elements['quantity'].value = item.quantity || '';
    form.elements['unit'].value = item.unit || '';
    form.elements['type'].value = item.type || '';
    form.elements['condition'].value = item.condition || '';

    // Expiry
    if (item.expiryDate && item.expiryDate.length > 10) {
        item.expiryDate = item.expiryDate.slice(0, 10); // Ensure date is in YYYY-MM-DD format
    }
    form.elements['expiryDate'].value = item.expiryDate || '';
    form.elements['expiryTime'].value = item.expiryTime || '';

    // Cooked
    if (item.cookedDate && item.cookedDate.length > 10) {
        item.cookedDate = item.cookedDate.slice(0, 10); // Ensure date is in YYYY-MM-DD format
    }
    form.elements['cookedDate'].value = item.cookedDate || '';
    form.elements['cookedTime'].value = item.cookedTime || '';

    // Clear preview area first
    const previewContainer = form.querySelector('.imagesPreview');
    previewContainer.innerHTML = '';

    // Show previews of existing images (if blob URLs)
    if (item.itemImages && item.itemImages.length > 0) {
        item.itemImages.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'food item';
            img.classList.add('img-thumbnail', 'me-2', 'mb-2');
            img.style.maxWidth = '150px';
            previewContainer.appendChild(img);
        });
    }

    // Store index in a hidden field if you plan to update item in foodItems
    form.dataset.index = itemIndex;
}

// Function to handle the edit food item form submission
function handleEditFoodItem(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const form = event.target;
    const itemIndex = parseInt(form.dataset.index); // Get the index of the item being edited
    let updatedItem = Object.fromEntries(new FormData(form).entries());

    const imageFiles = form.querySelector('input[name="itemImages[]"]').files;
    if (imageFiles.length === 0) {
        updatedItem['itemImages'] = foodItems[itemIndex].itemImages; // Keep existing images if no new ones
        updatedItem['itemImageFiles'] = foodItems[itemIndex].itemImageFiles; // Keep existing files
    }
    else {
        updatedItem['itemImages'] = selectedItemImages;
        updatedItem['itemImageFiles'] = Array.from(imageFiles);
    }

    updatedItem['quantity'] = parseInt(updatedItem['quantity']);
    foodItems[itemIndex] = updatedItem; // Update the foodItems array

    // Update the table row
    const itemsTable = document.getElementById('itemsTable');
    const row = itemsTable.rows[itemIndex + 1]; // Adjust for header row

    row.cells[1].innerText = updatedItem.name;
    row.cells[2].innerText = updatedItem.type;
    row.cells[3].innerText = updatedItem.condition;
    row.cells[4].innerText = `${updatedItem.quantity} ${updatedItem.unit}`;
    row.cells[5].innerText = `${updatedItem.cookedDate} - ${updatedItem.cookedTime}`;
    if (updatedItem.expiryDate || updatedItem.expiryTime) {
        row.cells[6].innerText = `${updatedItem.expiryDate} - ${updatedItem.expiryTime}`;
    }
    else {
        row.cells[6].innerText = 'N/A';
    }

    let imgHTML = 'N/A';
    if (updatedItem.itemImages.length > 0) {
        imgHTML = `
                <div class="border rounded p-1" style="max-width: 100px;">
                    <img src="${updatedItem.itemImages[0]}" alt="food item" class="img-fluid">
                    <div class="text-center hover-blue" data-bs-toggle="modal" data-bs-target="#images-modal">View all</div>
                </div>
            `;
    }
    row.cells[7].innerHTML = imgHTML;

    event.target.reset(); // Reset the form after submission
    event.target.querySelector('.imagesPreview').innerHTML = ''; // Clear image previews
    selectedItemImages = []; // Clear the selected images array
    showAlert(alertTypes.Success, 'Food item updated successfully!');

    const modal = bootstrap.Modal.getInstance(document.getElementById('edit-item-modal'));
    modal.hide();
}

// Function to open the image modal and display images
function handleOpenImagesModal(event) {
    const nextImageBtn = document.getElementById('nextImage');
    const prevImageBtn = document.getElementById('prevImage');
    const viewerImage = document.getElementById('viewerImage');
    let ind = event.target.closest('tr').rowIndex - 1;


    imagesModalURLs = foodItems[ind]['itemImages'];
    imagesModalIndex = 0;
    viewerImage.src = imagesModalURLs[imagesModalIndex];
    if (imagesModalURLs.length === 1) {
        nextImageBtn.disabled = true;
        prevImageBtn.disabled = true;
    }
    else {
        nextImageBtn.disabled = false;
        prevImageBtn.disabled = false;
    }
}

// Function to get the user's current location
function handleGetCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                // Optionally, you can also update the map marker here
                marker.setLatLng([lat, lng]);
                map.setView([lat, lng], 15);
                updateAddress(lat, lng);
                document.querySelector("input[name='latitude']").value = lat;
                document.querySelector("input[name='longitude']").value = lng;
            },
            function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showAlert(alertTypes.Warning, "Please allow location access to find your current location.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showAlert(alertTypes.Danger, "Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        showAlert(alertTypes.Warning, "The request to get user location timed out.");
                        break;
                    default:
                        showAlert(alertTypes.Danger, "An unknown error occurred.");
                        break;
                }
            }
        );
    }
    else {
        showAlert(alertTypes.Danger, 'Geolocation is not supported by this browser.');
    }
}

// Function to set the city location based on user input
function handleSetCityLocation(event) {
    const cityName = event.target.value;
    if (!cityName) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                // console.log(`Coordinates for ${cityName}:`, lat, lon);
                document.querySelector("input[name='latitude']").value = lat;
                document.querySelector("input[name='longitude']").value = lon;
                map.setView([lat, lon], 12);
                marker.setLatLng([lat, lon]);
                updateAddress(lat, lon);
            }
            else {
                showAlert(alertTypes.Warning, `Can't find location for City - "${cityName}" in maps.`);
            }
        })
        .catch(err => {
            // console.error("Geocoding error:", err);
            // alert("Something went wrong. Try again.");
        });
}

// Function appy js to make filters working
function setDonationFilters() {
    const searchInput = document.getElementById("searchTitleDesc");
    const activeFiltersContainer = document.getElementById("activeFiltersContainer");
    const clearAllBtn = document.querySelector(".clear-all");

    // Friendly names for filters
    const filterNames = {
        searchTitleDesc: "Search",
        foodType: "Food Type",
        foodCondition: "Food Condition",
        source: "Food Source",
        expiryDate: "Expiry Date",
        cookedDate: "Cooked Date",
        minPeopleFed: "Min People Fed",
        maxPeopleFed: "Max People Fed",
        donor: "Donor",
        state: "State",
        city: "City",
        pincode: "Pincode",
    };

    // Store current active filters
    let activeFilters = {};

    // Create a badge span for an active filter
    function createFilterBadge(type, value, id = "") {
        const span = document.createElement("span");
        span.className = "badge bg-secondary text-dark mx-1 d-flex align-items-center";
        span.setAttribute("data-filter-type", type);
        span.setAttribute("data-filter-value", value);
        if (id) span.setAttribute("data-filter-id", id);
        span.style.userSelect = "none";
        span.style.cursor = "default";

        span.innerHTML = `${filterNames[type] || type}: ${value} <i class="bi bi-x ms-2" style="cursor:pointer;"></i>`;
        return span;
    }

    // Update the active filters display area
    function updateActiveFiltersUI() {
        activeFiltersContainer.innerHTML = "";
        for (const [type, val] of Object.entries(activeFilters)) {
            if (Array.isArray(val)) {
                val.forEach(({ value, id }) => {
                    activeFiltersContainer.appendChild(createFilterBadge(type, value, id));
                });
            } else if (val !== "" && val !== null && val !== undefined) {
                activeFiltersContainer.appendChild(createFilterBadge(type, val));
            }
        }
    }

    // Read filters from all inputs and update activeFilters object
    function gatherFilters() {
        activeFilters = {};

        // Search input
        if (searchInput.value.trim() !== "") {
            activeFilters.searchTitleDesc = searchInput.value.trim();
        }

        // Checkboxes: foodType, foodCondition, source, donor (with data-filter-type)
        document.querySelectorAll("input[type=checkbox][data-filter-type]").forEach(chk => {
            if (chk.checked) {
                const type = chk.getAttribute("data-filter-type");
                if (!activeFilters[type]) activeFilters[type] = [];
                activeFilters[type].push({ value: chk.value, id: chk.id });
            }
        });

        // Date inputs
        ["expiryDate", "cookedDate"].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) {
                activeFilters[id] = el.value;
            }
        });

        // Number inputs minPeopleFed and maxPeopleFed
        const minPeople = document.getElementById("minPeopleFed")?.value.trim();
        const maxPeople = document.getElementById("maxPeopleFed")?.value.trim();
        if (minPeople) activeFilters.minPeopleFed = minPeople;
        if (maxPeople) activeFilters.maxPeopleFed = maxPeople;

        // Select inputs: state, city
        ["stateFilter", "cityFilter"].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) {
                activeFilters[id.replace("Filter", "")] = el.value;
            }
        });

        // Pincode input
        const pincodeInput = document.getElementById("pincodeFilter");
        if (pincodeInput && pincodeInput.value.trim()) {
            activeFilters.pincode = pincodeInput.value.trim();
        }
    }

    // Apply activeFilters back to inputs & checkboxes
    function applyFiltersToInputs() {
        // Clear all inputs first
        searchInput.value = "";
        document.querySelectorAll("input[type=checkbox][data-filter-type]").forEach(chk => (chk.checked = false));
        ["expiryDate", "cookedDate", "minPeopleFed", "maxPeopleFed", "pincodeFilter"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        ["stateFilter", "cityFilter"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        // Set search input
        if (activeFilters.searchTitleDesc) {
            searchInput.value = activeFilters.searchTitleDesc;
        }

        // Set checkboxes
        for (const [type, vals] of Object.entries(activeFilters)) {
            if (Array.isArray(vals)) {
                vals.forEach(({ id }) => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }

        // Set date inputs
        if (activeFilters.expiryDate) document.getElementById("expiryDate").value = activeFilters.expiryDate;
        if (activeFilters.cookedDate) document.getElementById("cookedDate").value = activeFilters.cookedDate;

        // Set number inputs
        if (activeFilters.minPeopleFed) document.getElementById("minPeopleFed").value = activeFilters.minPeopleFed;
        if (activeFilters.maxPeopleFed) document.getElementById("maxPeopleFed").value = activeFilters.maxPeopleFed;

        // Set selects
        if (activeFilters.state) document.getElementById("stateFilter").value = activeFilters.state;
        if (activeFilters.city) document.getElementById("cityFilter").value = activeFilters.city;

        // Set pincode
        if (activeFilters.pincode) document.getElementById("pincodeFilter").value = activeFilters.pincode;
    }

    // Remove a single filter from activeFilters
    function removeFilter(type, value, id = "") {
        if (Array.isArray(activeFilters[type])) {
            activeFilters[type] = activeFilters[type].filter(item => item.value !== value || item.id !== id);
            if (activeFilters[type].length === 0) delete activeFilters[type];
        } else {
            if (activeFilters[type] === value) delete activeFilters[type];
        }
    }

    // Called when any filter input changes
    function filtersChanged() {
        gatherFilters();
        updateActiveFiltersUI();
        applyFiltersToInputs();
        // TODO: Call your filtering function to fetch/display filtered donations here
    }

    // Initial setup
    filtersChanged();

    // Event listeners
    // Search input (with debounce)
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filtersChanged, 300);
    });

    // Checkbox, select, date, number inputs
    document.querySelectorAll("input[data-filter-type], select[data-filter-type], #minPeopleFed, #maxPeopleFed").forEach(el => {
        el.addEventListener("change", filtersChanged);
    });

    // Remove single active filter on badge × click
    activeFiltersContainer.addEventListener("click", e => {
        if (e.target.tagName === "I") {
            const span = e.target.parentElement;
            const type = span.getAttribute("data-filter-type");
            const value = span.getAttribute("data-filter-value");
            const id = span.getAttribute("data-filter-id") || "";
            removeFilter(type, value, id);
            updateActiveFiltersUI();
            applyFiltersToInputs();
            // TODO: Call your filtering function here after removal
        }
    });

    // Clear all button
    clearAllBtn.addEventListener("click", () => {
        activeFilters = {};
        updateActiveFiltersUI();
        applyFiltersToInputs();
        // TODO: Call your filtering function here after clearing all
    });
}

function validateRequestDonationForm(form) {
    function validateForm() {
        const messageInput = form.querySelector("#message");
        const errorId = "messageError";

        // remove existing error if any
        let oldError = document.getElementById(errorId);
        if (oldError) oldError.remove();

        const message = messageInput.value.trim();

        function showError(inputEl, msg, errorId) {
            const error = document.createElement("div");
            error.id = errorId;
            error.className = "text-danger mt-1 small";
            error.textContent = msg;
            inputEl.insertAdjacentElement("afterend", error);
        }

        // Validation checks
        if (message.length === 0) {
            showError(messageInput, "Message cannot be empty.", errorId);
            return false;
        }

        if (message.length > 500) {
            showError(messageInput, "Message cannot exceed 500 words.", errorId);
            return false;
        }

        return true;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateForm()) {
            submitRequestDonationForm(form);
        } else {
            showAlert(alertTypes.Danger, "Please fix the errors in the form.");
        }
    });
}

// Function to handle the request donation form submission
async function submitRequestDonationForm(form) {
    const donationId = document.getElementById("donationId").value;
    const donorId = document.getElementById("donorId").value;
    const ngoId = document.getElementById("ngoId").value;
    const message = document.getElementById("message").value;

    try {
        // POST request
        const response = await fetch(`/donations/${donationId}/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ donorId, ngoId, message })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Request sent successfully!");
            // Reset form
            document.getElementById("requestDonationForm").reset();
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("requestDonationModal"));
            modal.hide();
        } else {
            // ❌ Server returned error
            alert(result.error || "Something went wrong while sending the request.");
        }
    } catch (error) {
        // ❌ Network or unexpected error
        console.error("Error:", error);
        alert("Failed to send request. Please try again later.");
    }
}







/*  ---------------------------  Helper Functions  ---------------------------  */











/*  ---------------------------  Utility Functions  ---------------------------  */



// Show alert with a timer bar
let alertTimeout = null;
function showAlert(type = 'info', message = 'This is a message') {
    const alertContainer = document.getElementById('alertContainer');

    // Remove existing alert if any
    alertContainer.innerHTML = '';

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show shadow-sm border rounded mx-auto`;
    alert.style.position = 'relative';

    alert.innerHTML = `${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    <div class="progress-timer position-absolute bottom-0 start-0" style="height: 4px; background: rgba(0,0,0,0.15); width: 100%;"></div>`;
    alertContainer.appendChild(alert);

    // Animate the timer bar
    const timerBar = alert.querySelector('.progress-timer');
    timerBar.animate([
        { width: '100%' },
        { width: '0%' }
    ], {
        duration: 5000,
        easing: 'linear',
        fill: 'forwards'
    });

    // Auto-remove after 5 seconds
    alertTimeout = setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
        bsAlert.close();
    }, 5000);

    // If closed manually, clear the timeout
    alert.querySelector('.btn-close').addEventListener('click', () => {
        clearTimeout(alertTimeout);
    });
}



// Initialize google maps api
// let map, marker, geocoder;

// function initGMap() {
//     const defaultLoc = { lat: 21.5222, lng: 70.4579 };

//     map = new google.maps.Map(document.getElementById("pickupMap"), {
//         center: defaultLoc,
//         zoom: 15,
//     });

//     marker = new google.maps.Marker({
//         position: defaultLoc,
//         map,
//         draggable: true,
//     });

//     geocoder = new google.maps.Geocoder();

//     // When marker is dragged
//     marker.addListener("dragend", () => {
//         const pos = marker.getPosition();
//         getAddressFromCoords(pos.lat(), pos.lng());
//     });

//     // When map is clicked
//     map.addListener("click", (e) => {
//         marker.setPosition(e.latLng);
//         getAddressFromCoords(e.latLng.lat(), e.latLng.lng());
//     });

//     // Get initial address
//     getAddressFromCoords(defaultLoc.lat, defaultLoc.lng);
// }

// function getAddressFromCoords(lat, lng) {
//     const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

//     geocoder.geocode({ location: latlng }, (results, status) => {
//         if (status === "OK" && results[0]) {
//             document.querySelector('input[name="address"]').value = results[0].formatted_address;
//             console.log("Full Address:", results[0].formatted_address);
//         } else {
//             console.warn("Geocoder failed due to: " + status);
//         }
//     });
// }


/* ================= Registration Form Validation ================= */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register-form');
    if (!form) return;




});