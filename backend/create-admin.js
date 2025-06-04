const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash('Copef1957@', 10);
    
    // Verificar se o admin já existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'davicunha544@gmail.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin já existe! Atualizando senha...');
      
      // Atualizar a senha
      await prisma.admin.update({
        where: { email: 'davicunha544@gmail.com' },
        data: { 
          senha: hashedPassword
        }
      });
      
      console.log('Senha do admin atualizada com sucesso!');
    } else {
      // Criar novo admin
      const admin = await prisma.admin.create({
        data: {
          email: 'davicunha544@gmail.com',
          senha: hashedPassword,
          nome: 'Davi Cunha'
        }
      });
      
      console.log('Admin criado com sucesso:', admin);
    }
    
  } catch (error) {
    console.error('Erro ao criar/atualizar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
