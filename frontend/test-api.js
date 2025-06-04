const axios = require('axios');

const API_URL = 'http://localhost:3001/api/jogadores';

async function testAPI() {
  try {
    console.log(`Testando API: ${API_URL}`);
    const response = await axios.get(API_URL);
    
    console.log(`Status: ${response.status}`);
    console.log(`Tipo de dados: ${Array.isArray(response.data) ? 'Array' : typeof response.data}`);
    
    if (Array.isArray(response.data)) {
      console.log(`Número de jogadores: ${response.data.length}`);
      if (response.data.length > 0) {
        console.log('\nExemplo do primeiro jogador:');
        console.log(JSON.stringify(response.data[0], null, 2));
      }

      // Verificar se todos os jogadores têm a propriedade id e ativo
      const temPropriedades = response.data.every(j => typeof j.id === 'number' && typeof j.ativo !== 'undefined');
      console.log(`\nTodos os jogadores têm as propriedades 'id' e 'ativo'? ${temPropriedades}`);

      // Verificar jogadores ativos
      const jogadoresAtivos = response.data.filter(j => j.ativo);
      console.log(`Jogadores ativos: ${jogadoresAtivos.length}`);
    }
  } catch (error) {
    console.error('Erro ao chamar API:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Dados:', error.response.data);
    }
  }
}

testAPI();
