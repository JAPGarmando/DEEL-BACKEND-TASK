const { Router } = require( 'express');
const router = Router();
const {getProfile} = require( "../middleware/getProfile");
const {validateIsClient} = require( "../middleware/validateProfile");
const  {payJobById, getUnpaidJobs} = require ( '../controllers/jobs');

router
    .post('/:job_id/pay', getProfile, validateIsClient, payJobById)
    .get('/unpaid', getProfile, getUnpaidJobs)

module.exports = router;