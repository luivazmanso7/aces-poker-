import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Torneio = sequelize.define('Torneio', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  id_temporada: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  nome: DataTypes.STRING(100),
  data_hora: DataTypes.DATE,
  local: DataTypes.STRING(200),
  observacoes: DataTypes.TEXT,
});

export default Torneio;