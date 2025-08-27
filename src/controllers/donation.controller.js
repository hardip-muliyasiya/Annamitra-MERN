
const e = require('express');
const fs = require('fs');
const Donation = require('../models/donation.model');
const userController = require('./user.controller');
const mongoose = require('mongoose');


// Render the donation form
module.exports.renderDonationForm = (req, res) => {
    res.render('donations/new', {
        activePage: 'donate',
        errorMessage: null
    });
}

// Handle the donation form submission
module.exports.submitDonationForm = async (req, res) => {

    let donationImages = [];
    let foodItemsMap = [];
    let donorID = null;
    const formFields = req.body;

    if(formFields.description === 'null' || formFields.description === '') {
        formFields.description = null;
    }

    try {
        donorID = await userController.findOneUserId('Donor');
    }
    catch (error) {
        console.error('Error fetching user ID:', error);
    }

    const {
        title,
        source,
        numberOfPeopleFed,
        description,
        address,
        city,
        state,
        pincode = '362001',
        latitude,
        longitude,
        personName,
        contact,
        email
    } = formFields;

    const donationData = {
        donorId: donorID,
        title,
        source,
        items: foodItemsMap,
        numberOfPeopleFed: parseInt(numberOfPeopleFed),
        description,
        images: donationImages,
        address,
        city,
        state,
        pincode,
        location: {
            longitude,
            latitude
        },
        personName,
        contact,
        email
    };

    if (mongoose.connection.readyState !== 1) {
        console.error('Database connection is not ready');
        return res.json({ success: false, message: 'Database connection error! Faild to upload donation.' });
    }

    try {
        for(let itemIndex in formFields.foodItems) {
            tempItem = formFields.foodItems[itemIndex];
            if( !tempItem.name && !tempItem.quantity && !tempItem.unit && !tempItem.type && !tempItem.condition && !tempItem.cookedDate && !tempItem.cookedTime) {
                continue;
            }
            if( tempItem.expiryDate === 'null' || tempItem.expiryDate === '') {
                tempItem.expiryDate = null;
            }
            if( tempItem.expiryTime === 'null' || tempItem.expiryTime === '') {
                tempItem.expiryTime = null;
            }
            console.log('food item found', tempItem);
            let item = {
                name: tempItem.name,
                quantity: parseInt(tempItem.quantity),
                unit: tempItem.unit,
                type: tempItem.type,
                condition: tempItem.condition,
                cookedDate: tempItem.cookedDate,
                cookedTime: tempItem.cookedTime,
                expiryDate: tempItem.expiryDate,
                expiryTime: tempItem.expiryTime,
            }
            foodItemsMap.push(item);
        }

        // Handle file uploads / get image file paths
        req.files.forEach(file => {
            const { fieldname, path } = file;

            // Store donation images
            if (fieldname.startsWith('images')) {
                donationImages.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
            }

            // Store food item images
            const match = fieldname.match(/^foodItems\[(\d+)]\[itemImages]\[(\d+)]$/);
            if (match) {
                const index = match[1];
                if (!foodItemsMap[index].itemImages) foodItemsMap[index].itemImages = [];
                // if (!foodItemsMap[index].itemImages) foodItemsMap[index].itemImages = [];
                foodItemsMap[index].itemImages.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
            }
        });

        console.log('-----------------------------------------');
        console.log(donationData, 'donationData printed');

        const donation = new Donation(donationData);
        await donation.save();

        return res.status(201).json({
            success: true,
            message: 'Donation created successfully.',
            donationId: donation._id
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        return res.status(500).json({ success: false, message: 'Server error while saving donation.' });
    }
}

// View donation details
module.exports.viewDonationDetails = async (req, res) => {
    const donationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        return res.status(400).render('donations/show', {
            activePage: 'donation-details',
            errorMessage: 'Invalid donation ID.'
        })
    }

    try {
        const donation = await Donation.findById(donationId).populate('donorId', 'firstName lastName email contact');
        if (!donation) {
            return res.status(404).render('donations/show', {
                activePage: 'donation-details',
                errorMessage: 'Donation not found.'
            });
        }

        const ngoId = await userController.findOneUserId('NGO');

        res.render('donations/show', {
            activePage: 'donate',
            errorMessage: null,
            ngoId,
            donation
        });
    } catch (error) {
        console.error('Error fetching donation details:', error);
        res.status(500).render('donations/show', {
            activePage: 'donation-details',
            errorMessage: 'Server error while fetching donation details.'
        });
    }
}

// Render edit donation form
module.exports.renderEditDonationForm = async (req, res) => {
    const donationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        return res.status(400).render('donations/edit', {
            activePage: 'edit-donation',
            errorMessage: 'Invalid donation ID.'
        });
    }

    try {
        const donation = await Donation.findById(donationId).populate('donorId', 'firstName lastName email contact');
        if (!donation) {
            return res.status(404).render('donations/edit', {
                activePage: 'edit-donation',
                errorMessage: 'Donation not found.'
            });
        }

        console.log('Donation found for edit:', donation);
        res.render('donations/edit', {
            activePage: 'edit-donation',
            errorMessage: null,
            donation
        });
    } catch (error) {
        console.error('Error fetching donation for edit:', error);
        res.status(500).render('donations/edit', {
            activePage: 'edit-donation',
            errorMessage: 'Server error while fetching donation for edit.'
        });
    }
}

// Handle edit donation form submission
module.exports.submitEditDonationForm = async (req, res) => {

    let donationImages = [];
    let foodItemsMap = [];
    let oldImages = [];
    const formFields = req.body;

    if(formFields.description === 'null' || formFields.description === '') {
        formFields.description = null;
    }

    const {
        donationId,
        title,
        source,
        numberOfPeopleFed,
        description,
        address,
        city,
        state,
        pincode = '362001',
        latitude,
        longitude,
        personName,
        contact,
        email
    } = formFields;

    const donationData = {
        title,
        source,
        items: foodItemsMap,
        numberOfPeopleFed: parseInt(numberOfPeopleFed),
        description,
        images: donationImages,
        address,
        city,
        state,
        pincode,
        location: {
            longitude,
            latitude
        },
        personName,
        contact,
        email
    };

    if (mongoose.connection.readyState !== 1) {
        console.error('Database connection is not ready');
        return res.json({ success: false, message: 'Database connection error! Faild to update donation.' });
    }

    console.log('-----------------------------------------');
    console.log(formFields, 'formFields printed');
    console.log('-----------------------------------------');

    try {
        // Collect food items from form fields
        for(let itemIndex in formFields.foodItems) {
            let tempItem = formFields.foodItems[itemIndex];
            if( !tempItem.name && !tempItem.quantity && !tempItem.unit && !tempItem.type && !tempItem.condition && !tempItem.cookedDate && !tempItem.cookedTime) {
                continue;
            }
            if( tempItem.expiryDate === 'null' || tempItem.expiryDate === '') {
                tempItem.expiryDate = null;
            }
            if( tempItem.expiryTime === 'null' || tempItem.expiryTime === '') {
                tempItem.expiryTime = null;
            }
            console.log('food item found', tempItem);
            let item = {
                name: tempItem.name,
                quantity: parseInt(tempItem.quantity),
                unit: tempItem.unit,
                type: tempItem.type,
                condition: tempItem.condition,
                itemImages: tempItem.itemImages || [],
                cookedDate: tempItem.cookedDate,
                cookedTime: tempItem.cookedTime,
                expiryDate: tempItem.expiryDate,
                expiryTime: tempItem.expiryTime,
            }
            foodItemsMap.push(item);

            // Collect old item images if they exist
            if (tempItem.oldItemImages && tempItem.oldItemImages.length > 0) {
                oldImages.push(...tempItem.oldItemImages);
            }
        }

        // Handle file uploads / get image file paths
        req.files.forEach(file => {
            const { fieldname, path } = file;

            // Store donation images
            if (fieldname.startsWith('images')) {
                donationImages.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
            }

            // Store food item images
            const match = fieldname.match(/^foodItems\[(\d+)]\[itemImages]\[(\d+)]$/);
            if (match) {
                const index = match[1];
                if (!foodItemsMap[index].itemImages) foodItemsMap[index].itemImages = [];
                // if (!foodItemsMap[index].itemImages) foodItemsMap[index].itemImages = [];
                foodItemsMap[index].itemImages.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
            }
        });

        // If no new images are uploaded, use old images | and if found, collect old images
        if(donationImages.length === 0) {
            formFields.donationImages.forEach((image, i) => {
                if (image) {
                    donationImages.push(image);
                }
            });
        }
        else {
            oldImages.push(...formFields.oldDonationImages);
        }

        console.log('-----------------------------------------');
        console.log(donationData, 'donationData printed');
        console.log('-----------------------------------------\n\n');
        foodItemsMap.forEach((item, index) => {
            console.log(item['itemImages']);
        });
        console.log('-----------------------------------------\n\n');
        console.log(oldImages, 'oldImages printed');
        console.log('-----------------------------------------\n\n');

        // Delete old images if they exist
        if (oldImages.length > 0) {
            oldImages.forEach(image => {
                console.log(`Deleting old image: ${image}`);
                // first check if the image exists in /images/donations directory
                const imagePath = 'public/' + image.replace(/^\//, '');
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Deleted old image: ${image}`);
                } else {
                    console.warn(`Old image not found, skipping deletion: ${image}`);
                }
            });
        }

        // Validate donationId
        if (!mongoose.Types.ObjectId.isValid(donationId)) {
            return res.status(400).json({ success: false, message: 'Invalid donation ID.' });
        }

        // Now update the donation in the database
        const donation = await Donation.findByIdAndUpdate(donationId, donationData, { new: true });
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found! Failed to update.' });
        }

        console.log('\n\n\nDonation updated successfully:', donation);

        return res.status(201).json({
            success: true,
            message: 'Donation created successfully.',
            donationId: donation._id
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        return res.status(500).json({ success: false, message: 'Server error while saving donation.' });
    }
}

// Delete a donation
module.exports.deleteDonation = async (req, res) => {
    const donationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        return res.status(400).json({ success: false, message: 'Invalid donation ID.' });
    }

    try {
        const donation = await Donation.findByIdAndDelete(donationId);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }

        return res.status(200).json({ success: true, message: 'Donation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting donation:', error);
        return res.status(500).json({ success: false, message: 'Server error while deleting donation.' });
    }
}

// List all donations
module.exports.listDonations = async (req, res) => {
    try {
        if(!mongoose.connection.readyState) {
            console.error('Database connection is not ready');
            return res.status(500).render('donations/index', {
                activePage: 'donations',
                donations: [],
                errorMessage: 'Database connection error! Failed to fetch donations.'
            });
        }

        const donations = await Donation.find().populate('donorId', 'firstName lastName email contact').sort({ createdAt: -1 });
        res.render('donations/index', {
            activePage: 'donations',
            donations,
            errorMessage: null
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).render('donations/index', {
            activePage: 'donations',
            donations: [],
            errorMessage: 'Server error while fetching donations.'
        });
    }
}

