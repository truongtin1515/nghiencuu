const express = require('express')

const router = express.Router()

const userRegisterController = require("../controller/userRegister")

router.post("/register", userRegisterController)

module.exports = router