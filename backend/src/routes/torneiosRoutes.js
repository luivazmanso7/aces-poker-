import express from "express";
// Controller import { } from "../controllers/acesController.js";
// import { jwtToken } from "../middlewares/jwtToken.js";

const router = express.Router();


router.post("/register", cadastrarUsuario);



export default router;