import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";

export const router = {
  auth: authRouter,
  user: userRouter,
};
