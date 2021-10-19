const express = require('express');
const repairRequestController = require('../controllers/repairRequestController');
const commentControler = require('../controllers/commentController');
const router = express.Router();

// '/repairs'

router
  .route('/')
  .get(repairRequestController.getAll)
  .post(repairRequestController.createNew);

// Middleware to retrieve repairR from DB and passing it trhough req
router.use('/:id', repairRequestController.findRepairRequest);

router
  .route('/:id')
  .get(repairRequestController.getOne)
  .patch(repairRequestController.modifyStatus);

router.post('/:id/comments', commentControler.createNew);

module.exports = router;
