import { Router, type IRouter } from "express";
import healthRouter from "./health";
import parentRouter from "./parent";
import facultyRouter from "./faculty";
import hodRouter from "./hod";
import principalRouter from "./principal";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/parent", parentRouter);
router.use("/faculty", facultyRouter);
router.use("/hod", hodRouter);
router.use("/principal", principalRouter);
router.use("/auth", authRouter);

export default router;
