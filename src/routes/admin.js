const { Router } = require( 'express');
const router = Router();
const {getProfile} = require( "../middleware/getProfile");
const  {getBestProfession, getBestClients} = require ( '../controllers/admin');

router
    .get('/best-profession', getProfile, getBestProfession)
    .get('/best-clients', getProfile, getBestClients)


module.exports = router;