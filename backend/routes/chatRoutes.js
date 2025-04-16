const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');

// GET /api/chats?appId=xxx&receiptid=yyy&role=zzz -> fetch chat history
router.get('/', chatsController.getChats);

// GET /api/chats/clerk -> fetch distinct chat conversations where clerk is involved
router.get('/clerk', chatsController.getChatApplications);

// GET /api/chats/superintendent -> fetch distinct chat conversations where superintendent is involved
router.get('/superintendent', chatsController.getChatApplicationsSuperintendent);
router.get('/si', chatsController.getChatsSI);

router.get('/projectofficer', chatsController.getChatApplicationsProjectOfficer);
router.get('/po', chatsController.getChatsPO);

router.get('/mrofficer', chatsController.getChatApplicationsMRO);
router.get('/mro', chatsController.getChatsMRO);

router.get('/surveyor', chatsController.getChatApplicationsSurveyor);
router.get('/sur', chatsController.getChatsSurveyor);

router.get('/revenueinspector', chatsController.getChatApplicationsRevenueInspector);
router.get('/ri', chatsController.getChatsRevenueInspector);

router.get('/vrofficer', chatsController.getChatApplicationsVRO);
router.get('/vro', chatsController.getChatsVRO);

router.get('/rdofficer', chatsController.getChatApplicationsRDO);
router.get('/rdo', chatsController.getChatsRDO);

router.get('/jointcollector', chatsController.getChatApplicationsJC);
router.get('/jc', chatsController.getChatsJC);

router.get('/districtcollector', chatsController.getChatApplicationsDC);
router.get('/dc', chatsController.getChatsDC);

router.get('/ministrywelfare', chatsController.getChatApplicationsMW);
router.get('/mw', chatsController.getChatsMW);


// POST /api/chats -> send a new chat message
router.post('/', chatsController.sendChat);

module.exports = router;
