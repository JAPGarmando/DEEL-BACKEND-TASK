const { Router } = require( 'express');
const router = Router();
const {getProfile} = require( "../middleware/getProfile");
const  {payJobById, getUnpaidJobs} = require ( '../controllers/jobs');

// Middleware to validate if the profile is a client
const {validateIsClient} = require( "../middleware/validateProfile");

router
    .post('/:job_id/pay', getProfile, validateIsClient, payJobById)
    .get('/unpaid', getProfile, getUnpaidJobs)

module.exports = router;