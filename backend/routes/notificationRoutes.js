// routes/notificationRoutes.js
const express = require('express');
const { Notification, User } = require('../models');
const { sendEmailNotification } = require('../utils/sendNotification');
const router = express.Router();

// Endpoint para enviar notificações agendadas
router.post('/send', async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { status: 'pendente' } });
    for (const notif of notifications) {
      const user = await User.findByPk(notif.userId);
      if (notif.type === 'email') {
        await sendEmailNotification(user.email, 'Cobrança', notif.message);
        notif.status = 'enviado';
        notif.sentAt = new Date();
        await notif.save();
      }
      // Adicione SMS/Twilio se desejar
    }
    res.json({ message: 'Notificações processadas.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar notificações' });
  }
});

module.exports = router;
