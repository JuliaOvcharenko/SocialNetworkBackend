import { Router} from 'express'
import { UserRoutes } from '../modules/user/user.routes';
import { AlbumRoutes } from '../modules/album/album.routes';
import { PhotoRoutes } from "../modules/photos/photo.routes";
import { PostRoutes } from '../modules/post/post.routes';


export const appRouter = Router()

appRouter.use("/api/users", UserRoutes);
appRouter.use("/api/albums", AlbumRoutes);
appRouter.use("/api/albums", PhotoRoutes);
appRouter.use("/api/posts", PostRoutes);
