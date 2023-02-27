const express = require("express");
const router = express.Router();
const {
  pushNotif,
  getAllNotif,
  updateReadNotif,
} = require("../../controls/students/notifications");

router.post("/push-notif", pushNotif);
router.get("/all-notifs/get/:id", getAllNotif);
router.put("/update-notif/:id", updateReadNotif);

module.exports = router;
