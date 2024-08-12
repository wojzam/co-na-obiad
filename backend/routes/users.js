const express = require('express');
const router = express.Router();
const {requireToken, requireAdmin} = require('../middlewares/authMiddleware');
const userService = require("../services/userService");
const {matchedData, body} = require("express-validator");

router.get('/', requireToken, requireAdmin, async (req, res) => {
    try {
        const result = await userService.list();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/update-username', requireToken,
    body(['username'])
        .trim()
        .notEmpty()
        .isLength({
            min: 1,
            max: 64
        })
        .escape(), async (req, res) => {
        try {
            const data = matchedData(req);
            const result = await userService.updateUsername(req.user, data.username);
            res.status(result.status).json(result.body);
        } catch (err) {
            res.status(500);
        }
    });

router.put('/update-password', requireToken,
    body(['currentPassword', 'newPassword'])
        .trim()
        .notEmpty()
        .isLength({
            min: 8,
            max: 64
        })
        .escape(), async (req, res) => {
        try {
            const data = matchedData(req);
            const result = await userService.updatePassword(req.user, data.currentPassword, data.newPassword);
            res.status(result.status).json(result.body);
        } catch (err) {
            res.status(500);
        }
    });


module.exports = router;
