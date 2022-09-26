const payJobById = async (req, res) =>{
    // Get models 
    const {Job} = req.app.get('models');
    const {Contract} = req.app.get('models');

    const {job_id: jobId} = req.params
    const profileData  = req.profile;
    console.info("JOB ID =>", jobId);
    console.info("PROFILE DATA =>", profileData);

    // Find job with Contract model relation to get client and contractor ids
    const jobFound = await Job.findOne({
        where: {
            id: jobId,
        },
        include: Contract
    });
    if(jobFound.Contract.status !== 'in_progress') return res.status(401).send("NOT AN ACTIVE CONTRACT").end();
    if(+jobFound.Contract.ClientId !== +profileData.id) return res.status(401).send("PROFILE NOT THE SAME AS JOB- CLIENT ID").end();

    // More (or equal) profileData.balance than job price means that client can pay the amount
    if (profileData.balance >= jobFound.price) {
        // Setting attributes to update to set everything as paid
        const {ContractorId : contractorId} = jobFound.Contract;
        const {Profile} = req.app.get('models');
        profileData.balance = +(profileData.balance - jobFound.price);
        jobFound.paid = true;
        jobFound.paymentDate = new Date();
        jobFound.Contract.status = "terminated";

        const [newProfile] = await Promise.all([
            profileData.save(),
            jobFound.save(),
            jobFound.Contract.save(),
            Profile.increment('balance', { by: jobFound.price, where: { id: contractorId }})
        ]);
        return res.status(200).json(newProfile);
        
    } else {
        console.error(`CLIENT WITH ID ${profileData.id} DOESN'T HAVE ENOUGH BALANCE`);
        return res.status(401).end()
    }
    
};

module.exports = payJobById;
