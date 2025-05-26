import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { autenticarAdmin } from '../services/adminService.js';


export async function loginAdmin(req, res) {
  const { email, senha } = req.body;

  try {
    const token = await autenticarAdmin(email, senha);
    res.status(200).json({ mensagem: 'Login bem-sucedido', token });
  } catch (err) {
    const status = err.message === 'Admin não encontrado' || err.message === 'Senha incorreta' ? 401 : 500;
    res.status(status).json({ erro: err.message });
  }
}