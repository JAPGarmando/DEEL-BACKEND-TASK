const { Router } = require( 'express');
const router = Router();
const {getProfile} = require( "../middleware/getProfile");
const  {depositBalanceByUserId} = require ( '../controllers/balances');

router
    .post('/deposit/:userId', getProfile, depositBalanceByUserId)


module.exports = router;