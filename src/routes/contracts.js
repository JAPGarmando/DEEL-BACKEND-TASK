const { Router } = require( 'express');
const router = Router();
const {getProfile} = require( "../middleware/getProfile");
const  {getContractById, getContractsByProfile} = require ( '../controllers/contracts');

router
    .get('/:id', getProfile, getContractById)
    .get('/', getProfile, getContractsByProfile)

module.exports = router;