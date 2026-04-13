import { Router} from 'express'
import { UserRoutes } from '../modules/user/user.routes';


export const appRouter = Router()

appRouter.use("/api/users", UserRoutes);