import express from "express";
// Controller import { } from "../controllers/acesController.js";
// import { jwtToken } from "../middlewares/jwtToken.js";

const router = express.Router();


router.get('/torneios', (req, res) => {
    res.send('Lista de torneios');
  });



export default router;