const express = require('express');
const router = express.Router();
const {requireToken, requireAdmin} = require('../middlewares/authMiddleware');
const userService = require("../services/userService");
const {matchedData, body} = require("express-validator");
const {
    usernameSchema,
    newPasswordSchema,
    resetPasswordSchema,
    statusSchema
} = require("../middlewares/validation/userValidation");
const {validId} = require("../middlewares/validation/validId");

router.get('/', requireToken, requireAdmin, async (req, res) => {
    try {
        const result = await userService.list();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/update-username', requireToken, usernameSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await userService.updateUsername(req.user, data.username);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/update-password', requireToken, newPasswordSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await userService.updatePassword(req.user, data.currentPassword, data.newPassword);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/:id/reset-password', validId(), requireToken, requireAdmin, resetPasswordSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await userService.resetPassword(req.params.id, data.newPassword);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/:id/status', validId(), requireToken, requireAdmin, statusSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await userService.updateStatus(req.params.id, data.active);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;
