#!/usr/bin/env node
/**
 * Script para inicializar la base de datos en Railway
 * Uso: node init-db.js
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inmogestion',
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('🔄 Iniciando base de datos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Dividir por comandos (;)
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && !cmd.startsWith('/*'));

    let executed = 0;
    for (const command of commands) {
      try {
        await connection.execute(command);
        executed++;
      } catch (err) {
        // Ignorar errores de DROP TABLE si no existe
        if (!err.message.includes("doesn't exist")) {
          console.warn(`⚠️ Error en comando: ${command.substring(0, 50)}...`, err.message);
        }
      }
    }

    console.log(`✅ Base de datos inicializada exitosamente (${executed} comandos ejecutados)`);
    console.log('✅ Tablas creadas y datos cargados');
    
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Ejecutar si no está siendo importado como módulo
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
}

export default initializeDatabase;
