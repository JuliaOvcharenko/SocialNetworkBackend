import { Router } from "express";
import { AlbumController } from "./album.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { createAlbumSchema, updateAlbumSchema, updateAlbumVisibilitySchema } from "./album.schema";

export const AlbumRoutes = Router();

AlbumRoutes.post(
    "/",
    authenticateMiddleware,
    validateMiddleware(createAlbumSchema),
    AlbumController.create,
);

AlbumRoutes.patch(
    "/:id",
    authenticateMiddleware,
    validateMiddleware(updateAlbumSchema),
    AlbumController.edit,
);

AlbumRoutes.patch(
    "/:id/visibility",
    authenticateMiddleware,
    validateMiddleware(updateAlbumVisibilitySchema),
    AlbumController.editVisibility,
);

AlbumRoutes.get("/", authenticateMiddleware, AlbumController.getAll);

AlbumRoutes.delete("/:id", authenticateMiddleware, AlbumController.delete);