Para iniciar sesión como administrador necesitas un usuario con rol Administrador registrado. Hay una confusión en este archivo entre dominios y claves; se unifica a continuación.

Credenciales sembradas por SEEDS (si ejecutaste `SEEDS_MINIMOS.sql`):
- Usuario administrador existente: correo `admin@inmogestion.com` (NO `.local`)
- Contraseña: `Admin123!` (con mayúscula A y símbolo !)

Si intentas acceder con `admin@inmogestion.local` obtendrás 404 porque ese correo no existe.

Clave maestra para registrar nuevos administradores (usar exactamente así):
- `Admin2023!`

Pasos para registrar un nuevo administrador manualmente desde la UI:
1. Ir a `/registro`.
2. Introducir la clave maestra `Admin2023!`.
3. Completar datos y usar correo deseado (puedes usar dominio `.local` si prefieres, ej. `admin@inmogestion.local`).
4. Verificar el correo si el sistema lo solicita (se envía email de verificación).
5. Iniciar sesión con el nuevo correo y la contraseña elegida.

Si prefieres crear un admin adicional directo en SQL (ejemplo con correo local):
```sql
USE inmogestion;
INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol, estado)
VALUES ('Super','Admin','admin@inmogestion.local','3000000000','admin_local','$2b$10$F4rFJ4H9tXvZ9qCV6sP2EOVMlNqPi4Ewz0hLKi65u9BTsN/NTmRba',1,'Activo')
ON DUPLICATE KEY UPDATE correo=VALUES(correo);
```
La contraseña anterior corresponde a `Admin123!` (hash bcrypt cost 10). Genera otro hash con el script si deseas:
```bash
node .vscode/scripts/hash_password.js "MiNuevaPass!"
```

Resumen de acciones tras login administrador:
- Gestionar propiedades
- Administrar usuarios
- Ver reportes
- Registrar nuevos agentes

Nota sobre agente: Para pruebas rápidas puedes usar `agente@inmogestion.local` (si lo registras) o el sembrado `agente@inmogestion.local` si lo añades como semilla. El archivo original mencionaba `agente@test.com`; ajusta al dominio que adoptes.

Checklist de problemas comunes de acceso:
- 404 Usuario no encontrado: correo mal escrito o dominio distinto al registrado.
- 401 Contraseña incorrecta: revisa mayúsculas y símbolo final.
- 403 Correo no verificado: usar funcionalidad de reenviar verificación.

Mantén consistencia: Decide un solo dominio (`.com` para producción, `.local` para desarrollo) y actualiza los registros para evitar confusiones.
