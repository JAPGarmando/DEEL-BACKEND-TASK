const { Op } = require("sequelize");
const getContractById = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  console.info("ID =>", id);
  console.info("PROFILE DATA =>", req.profile);
  const { dataValues: profileData } = req.profile;
  const contract = await Contract.findOne({
    where: {
      id,
      ContractorId: profileData.id,
    },
  });
  if (!contract) return res.status(404).end();
  res.json(contract);
};



const getContractsByProfile = async (req, res) => {
  const { Contract } = req.app.get("models");
  console.info("PROFILE DATA =>", req.profile);
  const { dataValues: profileData } = req.profile;
  const whereFilter = {
    where: {
      status: { [Op.not]: "terminated" },
    },
  };
  profileData.type === "client"
    ? (whereFilter.where.ClientId = profileData.id)
    : (whereFilter.where.ContractorId = profileData.id);
  const contract = await Contract.findAll(whereFilter);
  if (!contract) return res.status(404).end();
  res.status(200).json(contract);
};

module.exports = {
  getContractById,
  getContractsByProfile,
};
