import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Temporada = sequelize.define('Temporada', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  nome: DataTypes.STRING(100),
  ano: DataTypes.INTEGER,
  criada_em: DataTypes.DATE,
});

export default Temporada;