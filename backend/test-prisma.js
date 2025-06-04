const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing Prisma connection...');
    
    // Test creating a photo
    const newPhoto = await prisma.foto.create({
      data: {
        imagem_url: 'https://example.com/test.jpg',
        album: 'Test Album',
        categoria: 'temporada',
        legenda: 'Test photo'
      }
    });
    
    console.log('Created photo:', newPhoto);
    
    // Test finding photos
    const photos = await prisma.foto.findMany();
    console.log('All photos:', photos);
    
    // Clean up
    await prisma.foto.delete({
      where: { id: newPhoto.id }
    });
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
