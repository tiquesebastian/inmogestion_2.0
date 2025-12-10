// Utilidad rápida para generar un hash bcrypt (cost 10) igual al usado por el backend.
// Uso:
// node .vscode/scripts/hash_password.js "MiPassword123!"

import bcrypt from 'bcryptjs';

async function main() {
  const plain = process.argv[2];
  if (!plain) {
    console.error('⚠ Proporciona la contraseña como argumento.');
    process.exit(1);
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plain, salt);
  console.log('Contraseña:', plain);
  console.log('Hash bcrypt:', hash);
  console.log('SQL ejemplo:');
  console.log(`UPDATE usuario SET contrasena='${hash}' WHERE correo='admin@inmogestion.local';`);
}
main();
