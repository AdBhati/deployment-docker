const Role = require("../models/role");

// create role
const create = async (req, res, next) => {
  try {
    const existingRole = await Role.findOne({ name: req.body.name });
    if (existingRole) return res.status(400).json({ error: "Role exists" });
    const newRole = new Role({ name: req.body.name });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { create };
