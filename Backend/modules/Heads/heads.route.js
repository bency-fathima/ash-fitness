import express from 'express';
import * as headsController from './heads.controller.js';

const router = express.Router();

router.post('/create', headsController.createHead);
router.get("/get-all-heads/:page/:limit", headsController.getAllHeads);
router.get("/founder/list/:page/:limit", headsController.founderHeadList)
router.get("/get-head/:id", headsController.getHeadById);
router.put("/update/:id", headsController.updateHead);
router.delete("/delete/:id", headsController.deleteHead);

router.get("/dashboard-data/:id", headsController.getDashboardData)
router.get("/get-all-coaches-by-head/:headId/:page/:limit",headsController.getAllCoachesByHead)
router.get("/get-all-users-by-head/:headId/:page/:limit",headsController.getAllUsersByHead)

export default router;