import {Request, Response, Router} from "express";
import PetModule from "../modules/PetModule";
import {CREATE_PET_REQUEST_SCHEMA, QUERY_PET_REQUEST_SCHEMA} from "../types/http/HttpSchemas";
import {checkSchema, validationResult} from "express-validator";
import {HttpResponse} from "../types/http/HttpResponse";
import {BadRequestError} from "../types/http/BadRequestError";
import {PetSchema} from "../types/pets/PetSchema";
import {INTERNAL_SERVER_ERROR_MSG} from "../utils/consts";
import {DBFilter} from "../types/db/DBFilter";

const router = Router();
const petModule = new PetModule();

router.post("/",
    checkSchema(CREATE_PET_REQUEST_SCHEMA, ['body']),
    async (req: Request, res: Response<HttpResponse<PetSchema>>) => {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length) {
                return res.status(400)
                    .send(new HttpResponse<PetSchema>().setErrors(validationErrors));
            }

            const pet = await petModule.createNewPet(req.body);
            res.json(new HttpResponse<PetSchema>().setData(pet))
        } catch (e) {
            if (e instanceof BadRequestError) {
                return res.status(400)
                    .send(new HttpResponse<PetSchema>().setErrors([{msg: e.message}]));
            }

            console.error(e);
            res.status(500)
                .send(new HttpResponse<PetSchema>().setErrors([{msg: INTERNAL_SERVER_ERROR_MSG}]));
        }
    });

router.post("/query",
    checkSchema(QUERY_PET_REQUEST_SCHEMA, ['body']),
    async (req: Request<{ filters: Array<DBFilter> }>, res: Response<HttpResponse<Array<PetSchema>>>) => {
        try {

            const validationErrors = validationResult(req).array();
            if (validationErrors.length) {
                return res.status(400)
                    .send(new HttpResponse<Array<PetSchema>>().setErrors(validationErrors));
            }

            const pets = await petModule.findPets(req.body.filters);
            res.send(new HttpResponse<Array<PetSchema>>().setData(pets));
        } catch (e) {
            if (e instanceof BadRequestError) {
                return res.status(400)
                    .send(new HttpResponse<Array<PetSchema>>().setErrors([{msg: e.message}]));
            }

            console.error(e);
            res.status(500)
                .send(new HttpResponse<Array<PetSchema>>().setErrors([{msg: INTERNAL_SERVER_ERROR_MSG}]));
        }
    });

router.delete("/", (req: Request, res: Response) => {
    //TODO validate request
    petModule.deletePet();
    //TODO response
});

router.patch("/", (req: Request, res: Response) => {
    //TODO validate request
    petModule.updatePet();
    //TODO response
});

export default router;