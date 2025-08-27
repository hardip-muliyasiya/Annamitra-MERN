const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const donationController = require('../controllers/donation.controller');

const storage = multer.diskStorage({
    destination: 'public/images/donations',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop());
    }
});
const upload = multer({ storage });


router.get('/new', donationController.renderDonationForm);

router.post('/new', upload.any(), donationController.submitDonationForm);

router.get('/:id', donationController.viewDonationDetails);

router.get('/:id/edit', donationController.renderEditDonationForm);

router.post('/:id/edit', upload.any(), donationController.submitEditDonationForm);

router.post('/:id/delete', donationController.deleteDonation);

router.get('/', donationController.listDonations);

module.exports = router;