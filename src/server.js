import express, { Router } from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev"); 
app.use(logger);
// morgan 함수는 middleware를 return 해준다.


app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () => 
    console.log(`✅ Sever listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);