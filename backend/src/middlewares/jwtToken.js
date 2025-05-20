import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const autenticarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ err: "token nao fornecido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido" });
        }
        req.user = user;
        next();
    });
};