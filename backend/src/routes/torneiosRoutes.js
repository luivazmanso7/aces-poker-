import express from "express";
import dotenv from 'dotenv';
// Controller import { } from "../controllers/acesController.js";
// import { jwtToken } from "../middlewares/jwtToken.js";

const router = express.Router();


router.get('/', (req, res) => {
    res.send('');
  });



export default router;