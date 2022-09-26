const validateIsClient = async (req, res, next ) => {
    // Only available if profile was previously retrieved
    if (!req.profile){
        console.error("PROFILE NOT RETRIEVED");
        return res.status(401).end()
    } 
    const {dataValues: profileData } = req.profile;
    if (profileData.type === 'client') return next();
    // Profile is not client
    else return res.status(401).send("NOT A CLIENT").end();

}

const validateIsContractor = async (req, res, next ) => {
    // Only available if profile was previously retrieved
    if (!req.profile){
        console.error("PROFILE NOT RETRIEVED");
        return res.status(401).end()
    } 
    const {dataValues: profileData } = req.profile;
    if (profileData.type === 'contractor') return next();
    // Profile is not client
    else return res.status(401).end();

}

module.exports = {validateIsClient, validateIsContractor}