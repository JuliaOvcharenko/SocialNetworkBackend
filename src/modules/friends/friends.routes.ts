import { Router } from "express";
import { friendsController } from "./friends.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";

const router = Router();


router.use(authenticateMiddleware);


router.get("/requests", friendsController.getRequests);
router.get("/suggestions", friendsController.getSuggestions);
router.get("/overview", friendsController.getOverview);
router.get("/", friendsController.getAllFriends);


router.post("/requests", friendsController.sendRequest);
router.post("/:id/accept", friendsController.acceptAction);


router.delete("/:id", friendsController.deleteAction);

export default router;