import dotenv from "dotenv";
import sequelize from "./config/db.js";
import express from "express";
import cors from "cors";
import router from "./routes/torneiosRoutes.js";
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use('/', adminRoutes);


const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log(" Banco conectado e sincronizado");
  })
  .catch((error) => {
    console.error(" Erro ao conectar com o banco:", error);
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


