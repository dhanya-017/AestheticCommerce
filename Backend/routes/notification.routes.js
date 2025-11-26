const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require('../controllers/notification.controller');
const { protect } = require('../Middleware/auth.middleware');

// Get all notifications for the logged-in user
router.get('/', protect, getNotifications);

// Mark a notification as read
router.put('/:id/read', protect, markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', protect, markAllNotificationsAsRead);

module.exports = router;
