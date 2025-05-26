import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function autenticarAdmin(email, senha) {
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) throw new Error('Admin não encontrado');

  const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
  if (!senhaValida) throw new Error('Senha incorreta');

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // lebrar de diminuir o tempo de expiração do token para produção
  );

  return token;
}