import db from "../config/db.js"

export const creatuser = (nome, email, senha_hash, callback) => {
    db.query(
      "INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome, email, senha_hash],
      callback
    );
  };