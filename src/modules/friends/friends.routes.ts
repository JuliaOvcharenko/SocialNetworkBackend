import { Router } from "express";
import { friendsController } from "./friends.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";

const router = Router();

router.use(authenticateMiddleware);

router.get("/requests",    friendsController.getRequests);
router.get("/suggestions", friendsController.getSuggestions);
router.get("/overview",    friendsController.getOverview);
router.get("/",            friendsController.getAllFriends);

router.post("/requests",          friendsController.sendRequest);
router.post("/requests/:id/accept", friendsController.acceptRequest);

router.delete("/requests/:id", friendsController.deleteRequest);
router.delete("/:id",          friendsController.deleteFriend);

export default router;