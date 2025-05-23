import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function loginAdmin(req, res) {
  const { email, senha } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) return res.status(404).json({ erro: 'Admin não encontrado' });

    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    res.status(200).json({ mensagem: 'Login bem-sucedido', token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhe: err.message });
  }
}