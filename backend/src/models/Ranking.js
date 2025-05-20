import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ranking = sequelize.define('Ranking', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  id_jogador: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  id_temporada: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  posicao: DataTypes.INTEGER,
  pontuacao: DataTypes.INTEGER,
});

export default Ranking;