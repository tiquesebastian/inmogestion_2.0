import cron from 'node-cron';
import db from '../config/db.js';
import { enviarEmailRecordatorioVisita } from './email.service.js';

/**
 * Tarea CRON que se ejecuta todos los días a las 10:00 AM
 * Busca visitas programadas para el día siguiente y envía recordatorios
 */
export const iniciarTareaRecordatorios = () => {
  // Ejecutar todos los días a las 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Ejecutando tarea de recordatorios de visitas...');
    
    try {
      // Buscar visitas para mañana
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const fechaManana = manana.toISOString().split('T')[0];

      const [visitas] = await db.query(`
        SELECT 
          v.id_visita,
          v.fecha_visita,
          v.hora_visita,
          v.recordatorio_enviado,
          c.nombre_cliente,
          c.apellido_cliente,
          c.correo_cliente,
          p.direccion_formato as propiedad_direccion,
          p.tipo_propiedad,
          u.nombre as agente_nombre,
          u.telefono as agente_telefono
        FROM visita v
        INNER JOIN cliente c ON v.id_cliente = c.id_cliente
        INNER JOIN propiedad p ON v.id_propiedad = p.id_propiedad
        LEFT JOIN usuario u ON v.id_agente = u.id_usuario
        WHERE v.fecha_visita = ?
          AND v.estado_visita = 'Pendiente'
          AND (v.recordatorio_enviado IS NULL OR v.recordatorio_enviado = 0)
      `, [fechaManana]);

      console.log(`📋 Encontradas ${visitas.length} visitas para enviar recordatorios`);

      // Enviar recordatorios
      for (const visita of visitas) {
        const emailData = {
          cliente_nombre: `${visita.nombre_cliente} ${visita.apellido_cliente}`,
          cliente_email: visita.correo_cliente,
          propiedad_direccion: visita.propiedad_direccion,
          propiedad_tipo: visita.tipo_propiedad,
          fecha_visita: visita.fecha_visita,
          hora_visita: visita.hora_visita,
          agente_nombre: visita.agente_nombre,
          agente_telefono: visita.agente_telefono
        };

        const resultado = await enviarEmailRecordatorioVisita(emailData);

        if (resultado.success) {
          // Marcar como enviado
          await db.query(
            'UPDATE visita SET recordatorio_enviado = 1 WHERE id_visita = ?',
            [visita.id_visita]
          );
          console.log(`✅ Recordatorio enviado para visita #${visita.id_visita}`);
        } else {
          console.error(`❌ Error al enviar recordatorio para visita #${visita.id_visita}`);
        }
      }

      console.log('✅ Tarea de recordatorios completada');
    } catch (error) {
      console.error('❌ Error en tarea de recordatorios:', error);
    }
  });

  console.log('✅ Tarea de recordatorios programada (diario a las 10:00 AM)');
};

// También permitir ejecución manual
export const enviarRecordatoriosManual = async () => {
  console.log('📧 Enviando recordatorios manualmente...');
  // Mismo código que arriba pero sin el cron
  // ... (puedes implementarlo si quieres)
};
