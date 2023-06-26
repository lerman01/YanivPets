import * as express from "express";
import PetRoute from "../routes/PetRoute";

export const initServer = () => {
    const PORT = 3000;
    const app = express();

    app.use(express.json());

    app.use('/pet', PetRoute)

    app.listen(PORT, () => {
        console.log(`Server Started (${PORT})`);
    });
}