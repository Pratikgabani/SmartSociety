import { Router } from 'express';
import { sendContactMessage } from '../controllers/contact.controllers.js';

const router = Router();

// No auth required – this is a public landing-page form
router.post('/send', sendContactMessage);

export default router;
