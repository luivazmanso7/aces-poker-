import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  nome: DataTypes.STRING(100),
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  senha_hash: DataTypes.TEXT,
});

export default Admin;