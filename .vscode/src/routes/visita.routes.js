import { Router } from "express";
import { registrarVisita, listarVisitas, actualizarVisita, cancelarVisitaController } from "../controllers/visita.controller.js";

const router = Router();

// Listar visitas (opcional ?id_cliente=)
router.get('/', listarVisitas);

// Crear visita (agente crea/agenda una visita)
router.post('/', registrarVisita);

// Actualizar visita (reagendar / cambiar notas / estado)
router.put('/:id', actualizarVisita);

// Cancelar visita
router.patch('/:id/cancelar', cancelarVisitaController);

export default router;
