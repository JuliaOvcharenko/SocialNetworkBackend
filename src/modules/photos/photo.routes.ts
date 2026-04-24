import { Router } from "express";
import { PhotoController } from "./photo.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { uploadMiddleware, processImageMiddleware } from "../../middlewares/upload.middleware";
import { updatePhotoVisibilitySchema } from "./photo.schema";

export const PhotoRoutes = Router({ mergeParams: true });


PhotoRoutes.post(
    "/:id/photos",
    authenticateMiddleware,
    uploadMiddleware.single("photo"),
    processImageMiddleware(800),
    PhotoController.create,
);

PhotoRoutes.patch(
    "/:id/photos/:photoId/visibility",
    authenticateMiddleware,
    validateMiddleware(updatePhotoVisibilitySchema),
    PhotoController.updateVisibility,
);

PhotoRoutes.get(
    "/:id/photos",
    authenticateMiddleware,
    PhotoController.getAll,
);

PhotoRoutes.delete(
    "/:id/photos/:photoId",
    authenticateMiddleware,
    PhotoController.delete,
);