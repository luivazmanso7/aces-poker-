import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Foto = sequelize.define('Foto', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  id_torneio: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  imagem_url: DataTypes.TEXT,
  legenda: DataTypes.STRING(255),
  data: DataTypes.DATEONLY,
  album: DataTypes.STRING(100),
});

export default Foto;