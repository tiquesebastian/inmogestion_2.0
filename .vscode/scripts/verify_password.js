// Verifica si una contraseña en texto plano coincide con un hash bcrypt almacenado.
// Uso:
// node .vscode/scripts/verify_password.js "$2b$10$F4rFJ4H9tXvZ9qCV6sP2EOVMlNqPi4Ewz0hLKi65u9BTsN/NTmRba" "Admin123!"
import bcrypt from 'bcryptjs';

async function main(){
  const hash = process.argv[2];
  const plain = process.argv[3];
  if(!hash || !plain){
    console.log('Uso: node .vscode/scripts/verify_password.js <hash> <password>');
    process.exit(1);
  }
  const ok = await bcrypt.compare(plain, hash);
  console.log(ok ? '✅ Coincide' : '❌ No coincide');
}
main();
