export const plantillaContratoApartamento = (datos) => {
  const {
    vendedor_nombre,
    vendedor_apellido,
    vendedor_tipo_documento,
    vendedor_numero_documento,
    comprador_nombre,
    comprador_apellido,
    comprador_tipo_documento,
    comprador_numero_documento,
    inmueble_matricula,
    inmueble_area_m2,
    inmueble_direccion,
    inmueble_linderos,
    inmueble_descripcion,
    precio_venta,
    forma_pago,
    clausulas_adicionales,
    lugar_firma,
    fecha_firma
  } = datos;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Compraventa - Apartamento</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; margin: 40px; }
    h1 { text-align: center; font-size: 14pt; margin-bottom: 20px; }
    .section { margin-bottom: 15px; text-align: justify; }
    .firma { margin-top: 80px; }
    .firma-linea { border-top: 1px solid #000; width: 250px; display: inline-block; }
    .fecha { text-align: right; margin-bottom: 20px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>

<h1>CONTRATO DE COMPRAVENTA DE APARTAMENTO</h1>

<div class="fecha">Versión 1.1</div>

<div class="section">
  <strong>En ${lugar_firma}, a ${fecha_firma}</strong>
</div>

<div class="section">
  <strong>REUNIDOS</strong>
</div>

<div class="section">
  De una parte, <strong>${vendedor_nombre} ${vendedor_apellido}</strong>, mayor de edad, <strong>ESTADO CIVIL ${vendedor_tipo_documento === 'NIT' ? 'y SI ES CASADO, SE INDICARÁ EL RÉGIMEN ECONÓMICO MATRIMONIAL' : 'SOLTERO(A), CASADO(A) o VIUDO(A)'}</strong>, con domicilio en <strong>DOMICILIO EXACTO</strong>, provisto de <strong>DNI NÚMERO</strong> <strong>${vendedor_numero_documento}</strong> (en adelante el "vendedor").
</div>

<div class="section">
  De otra parte, <strong>${comprador_nombre} ${comprador_apellido}</strong>, mayor de edad, <strong>ESTADO CIVIL ${comprador_tipo_documento === 'NIT' ? 'y SI ES CASADO, SE INDICARÁ EL RÉGIMEN ECONÓMICO MATRIMONIAL' : 'SOLTERO(A), CASADO(A) o VIUDO(A)'}</strong>, con domicilio en <strong>DOMICILIO EXACTO</strong>, provisto de <strong>DNI ${comprador_tipo_documento}</strong> número <strong>${comprador_numero_documento}</strong> (en adelante el "comprador").
</div>

<div class="section">
  <strong>INTERVIENEN</strong>
</div>

<div class="section">
  En su propio nombre y derecho.
</div>

<div class="section">
  Ambas partes reconocen mutuamente la capacidad legal necesaria, ambas partes acuerdan convenir libremente lo aquí estipulado y,
</div>

<div class="section">
  <strong>EXPONEN</strong>
</div>

<div class="section">
  <strong>I.</strong> Que <strong>${vendedor_nombre} ${vendedor_apellido}</strong> (en adelante el "vendedor") es propietario del siguiente inmueble:
</div>

<div class="section">
  Finca <strong>NÚMERO MATRICULA: ${inmueble_matricula || 'NÚMERO'}</strong>, inscrita en el <strong>Registro de la Propiedad ${inmueble_matricula ? 'con el número de finca ' + inmueble_matricula : 'NÚMERO'}</strong>, ocupada por una vivienda en forma de <strong>APARTAMENTO</strong>.
</div>

<div class="section">
  <strong>II.</strong> Que en virtud han convenido el otorgamiento del presente <strong>CONTRATO DE COMPRAVENTA DE BIEN INMUEBLE</strong>.
</div>

<div class="section">
  Estos contratos se regirán por las siguientes:
</div>

<div class="section">
  <strong>CLÁUSULAS</strong>
</div>

<div class="section">
  <strong>PRIMERA.- OBJETO DEL CONTRATO</strong><br>
  Por el presente contrato, <strong>${vendedor_nombre} ${vendedor_apellido}</strong> (el vendedor) transmite en propiedad a <strong>${comprador_nombre} ${comprador_apellido}</strong> (el comprador) el inmueble descrito en el apartado <strong>EXPONEN</strong> de este contrato.
</div>

<div class="section">
  <strong>Descripción del inmueble:</strong><br>
  <strong>Tipo:</strong> Apartamento<br>
  <strong>Dirección:</strong> ${inmueble_direccion}<br>
  <strong>Área:</strong> ${inmueble_area_m2 || 'N/A'} metros cuadrados<br>
  <strong>Matrícula Inmobiliaria:</strong> ${inmueble_matricula || 'N/A'}<br>
  ${inmueble_linderos ? `<strong>Linderos:</strong> ${inmueble_linderos}<br>` : ''}
  ${inmueble_descripcion ? `<strong>Descripción adicional:</strong> ${inmueble_descripcion}<br>` : ''}
</div>

<div class="section">
  <strong>SEGUNDA.- PRECIO Y FORMA DE PAGO</strong><br>
  El precio de la venta se fija en la cantidad de <strong>$${new Intl.NumberFormat('es-CO').format(precio_venta)}</strong> pesos colombianos.
</div>

<div class="section">
  <strong>Forma de pago:</strong><br>
  ${forma_pago}
</div>

<div class="section">
  <strong>TERCERA.- ENTREGA DEL INMUEBLE</strong><br>
  La entrega material del inmueble se realizará en el momento de la firma de la escritura pública de compraventa, quedando el comprador como único propietario y responsable del mismo a partir de ese momento.
</div>

<div class="section">
  <strong>CUARTA.- GASTOS E IMPUESTOS</strong><br>
  Los gastos derivados de la formalización de la compraventa (notariales, registrales e impuestos) serán asumidos por el comprador, salvo pacto en contrario.
</div>

<div class="section">
  <strong>QUINTA.- DECLARACIONES DEL VENDEDOR</strong><br>
  El vendedor declara que el inmueble se encuentra libre de cargas, gravámenes, arrendamientos y ocupantes, y que no existen deudas pendientes por servicios públicos o administración.
</div>

${clausulas_adicionales ? `
<div class="section">
  <strong>CLÁUSULAS ADICIONALES</strong><br>
  ${clausulas_adicionales}
</div>
` : ''}

<div class="section">
  Y en prueba de conformidad, ambas partes firman el presente contrato por duplicado en el lugar y fecha indicados en el encabezamiento.
</div>

<div class="firma">
  <div style="display: inline-block; width: 45%; text-align: center;">
    <div class="firma-linea"></div><br>
    <strong>EL VENDEDOR</strong><br>
    ${vendedor_nombre} ${vendedor_apellido}<br>
    ${vendedor_tipo_documento}: ${vendedor_numero_documento}
  </div>
  <div style="display: inline-block; width: 45%; text-align: center; float: right;">
    <div class="firma-linea"></div><br>
    <strong>EL COMPRADOR</strong><br>
    ${comprador_nombre} ${comprador_apellido}<br>
    ${comprador_tipo_documento}: ${comprador_numero_documento}
  </div>
</div>

</body>
</html>
  `;
};

export const plantillaContratoCasa = (datos) => {
  const {
    vendedor_nombre,
    vendedor_apellido,
    vendedor_tipo_documento,
    vendedor_numero_documento,
    comprador_nombre,
    comprador_apellido,
    comprador_tipo_documento,
    comprador_numero_documento,
    inmueble_matricula,
    inmueble_area_m2,
    inmueble_direccion,
    inmueble_linderos,
    inmueble_descripcion,
    precio_venta,
    forma_pago,
    clausulas_adicionales,
    lugar_firma,
    fecha_firma
  } = datos;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Compraventa - Casa</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; margin: 40px; }
    h1 { text-align: center; font-size: 14pt; margin-bottom: 20px; }
    .section { margin-bottom: 15px; text-align: justify; }
    .firma { margin-top: 80px; }
    .firma-linea { border-top: 1px solid #000; width: 250px; display: inline-block; }
    .fecha { text-align: right; margin-bottom: 20px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>

<h1>CONTRATO DE COMPRAVENTA DE CASA</h1>

<div class="fecha">Versión 1.1</div>

<div class="section">
  <strong>En ${lugar_firma}, a ${fecha_firma}</strong>
</div>

<div class="section">
  <strong>REUNIDOS</strong>
</div>

<div class="section">
  De una parte, <strong>${vendedor_nombre} ${vendedor_apellido}</strong>, mayor de edad, con domicilio en el inmueble objeto de este contrato, identificado con <strong>${vendedor_tipo_documento}</strong> número <strong>${vendedor_numero_documento}</strong> (en adelante el "vendedor").
</div>

<div class="section">
  De otra parte, <strong>${comprador_nombre} ${comprador_apellido}</strong>, mayor de edad, identificado con <strong>${comprador_tipo_documento}</strong> número <strong>${comprador_numero_documento}</strong> (en adelante el "comprador").
</div>

<div class="section">
  <strong>INTERVIENEN</strong>
</div>

<div class="section">
  En su propio nombre y derecho, reconociendo mutuamente la capacidad legal necesaria para obligarse mediante el presente contrato.
</div>

<div class="section">
  <strong>EXPONEN</strong>
</div>

<div class="section">
  <strong>I.</strong> Que <strong>${vendedor_nombre} ${vendedor_apellido}</strong> es propietario del siguiente inmueble tipo <strong>CASA</strong>, ubicado en <strong>${inmueble_direccion}</strong>.
</div>

<div class="section">
  <strong>II.</strong> Que ambas partes han convenido la compraventa del mencionado inmueble en las condiciones que se detallan a continuación.
</div>

<div class="section">
  <strong>CLÁUSULAS</strong>
</div>

<div class="section">
  <strong>PRIMERA.- OBJETO DEL CONTRATO</strong><br>
  Por el presente contrato, <strong>${vendedor_nombre} ${vendedor_apellido}</strong> vende a <strong>${comprador_nombre} ${comprador_apellido}</strong> el inmueble tipo casa descrito a continuación:
</div>

<div class="section">
  <strong>Descripción del inmueble:</strong><br>
  <strong>Tipo:</strong> Casa<br>
  <strong>Dirección:</strong> ${inmueble_direccion}<br>
  <strong>Área construida:</strong> ${inmueble_area_m2 || 'N/A'} metros cuadrados<br>
  <strong>Matrícula Inmobiliaria:</strong> ${inmueble_matricula || 'N/A'}<br>
  ${inmueble_linderos ? `<strong>Linderos:</strong> ${inmueble_linderos}<br>` : ''}
  ${inmueble_descripcion ? `<strong>Descripción adicional:</strong> ${inmueble_descripcion}<br>` : ''}
</div>

<div class="section">
  <strong>SEGUNDA.- PRECIO Y FORMA DE PAGO</strong><br>
  El precio de venta se fija en <strong>$${new Intl.NumberFormat('es-CO').format(precio_venta)}</strong> pesos colombianos.
</div>

<div class="section">
  <strong>Forma de pago:</strong><br>
  ${forma_pago}
</div>

<div class="section">
  <strong>TERCERA.- ENTREGA Y POSESIÓN</strong><br>
  El vendedor entregará el inmueble libre de ocupantes, en buen estado de conservación y con todos los servicios públicos al día.
</div>

<div class="section">
  <strong>CUARTA.- GASTOS Y TRIBUTOS</strong><br>
  Todos los gastos notariales, de registro y de impuestos derivados de esta compraventa serán asumidos por el comprador.
</div>

<div class="section">
  <strong>QUINTA.- SANEAMIENTO</strong><br>
  El vendedor responde del saneamiento por evicción y por vicios ocultos conforme a la legislación vigente.
</div>

${clausulas_adicionales ? `
<div class="section">
  <strong>CLÁUSULAS ADICIONALES</strong><br>
  ${clausulas_adicionales}
</div>
` : ''}

<div class="section">
  Y en prueba de conformidad, firman el presente contrato en ${lugar_firma}, a ${fecha_firma}.
</div>

<div class="firma">
  <div style="display: inline-block; width: 45%; text-align: center;">
    <div class="firma-linea"></div><br>
    <strong>EL VENDEDOR</strong><br>
    ${vendedor_nombre} ${vendedor_apellido}<br>
    ${vendedor_tipo_documento}: ${vendedor_numero_documento}
  </div>
  <div style="display: inline-block; width: 45%; text-align: center; float: right;">
    <div class="firma-linea"></div><br>
    <strong>EL COMPRADOR</strong><br>
    ${comprador_nombre} ${comprador_apellido}<br>
    ${comprador_tipo_documento}: ${comprador_numero_documento}
  </div>
</div>

</body>
</html>
  `;
};

export const plantillaContratoLote = (datos) => {
  const {
    vendedor_nombre,
    vendedor_apellido,
    vendedor_tipo_documento,
    vendedor_numero_documento,
    comprador_nombre,
    comprador_apellido,
    comprador_tipo_documento,
    comprador_numero_documento,
    inmueble_matricula,
    inmueble_area_m2,
    inmueble_direccion,
    inmueble_linderos,
    inmueble_descripcion,
    precio_venta,
    forma_pago,
    clausulas_adicionales,
    lugar_firma,
    fecha_firma
  } = datos;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Compraventa - Lote</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; margin: 40px; }
    h1 { text-align: center; font-size: 14pt; margin-bottom: 20px; }
    .section { margin-bottom: 15px; text-align: justify; }
    .firma { margin-top: 80px; }
    .firma-linea { border-top: 1px solid #000; width: 250px; display: inline-block; }
    .fecha { text-align: right; margin-bottom: 20px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>

<h1>CONTRATO DE COMPRAVENTA DE LOTE</h1>

<div class="fecha">Versión 1.1</div>

<div class="section">
  <strong>En ${lugar_firma}, a ${fecha_firma}</strong>
</div>

<div class="section">
  <strong>REUNIDOS</strong>
</div>

<div class="section">
  De una parte, <strong>${vendedor_nombre} ${vendedor_apellido}</strong>, identificado con <strong>${vendedor_tipo_documento}</strong> número <strong>${vendedor_numero_documento}</strong>, en calidad de vendedor.
</div>

<div class="section">
  De otra parte, <strong>${comprador_nombre} ${comprador_apellido}</strong>, identificado con <strong>${comprador_tipo_documento}</strong> número <strong>${comprador_numero_documento}</strong>, en calidad de comprador.
</div>

<div class="section">
  <strong>EXPONEN</strong>
</div>

<div class="section">
  <strong>I.</strong> Que el vendedor es propietario de un lote de terreno ubicado en <strong>${inmueble_direccion}</strong>, con matrícula inmobiliaria número <strong>${inmueble_matricula || 'PENDIENTE'}</strong>.
</div>

<div class="section">
  <strong>II.</strong> Que ambas partes acuerdan celebrar el presente contrato de compraventa bajo las siguientes estipulaciones.
</div>

<div class="section">
  <strong>CLÁUSULAS</strong>
</div>

<div class="section">
  <strong>PRIMERA.- OBJETO</strong><br>
  El vendedor transfiere al comprador la propiedad del siguiente lote de terreno:
</div>

<div class="section">
  <strong>Descripción del lote:</strong><br>
  <strong>Ubicación:</strong> ${inmueble_direccion}<br>
  <strong>Área total:</strong> ${inmueble_area_m2 || 'N/A'} metros cuadrados<br>
  <strong>Matrícula Inmobiliaria:</strong> ${inmueble_matricula || 'N/A'}<br>
  ${inmueble_linderos ? `<strong>Linderos:</strong><br>${inmueble_linderos}<br>` : ''}
  ${inmueble_descripcion ? `<strong>Descripción:</strong> ${inmueble_descripcion}<br>` : ''}
</div>

<div class="section">
  <strong>SEGUNDA.- PRECIO Y PAGO</strong><br>
  El precio de venta del lote es de <strong>$${new Intl.NumberFormat('es-CO').format(precio_venta)}</strong> pesos colombianos.
</div>

<div class="section">
  <strong>Forma de pago:</strong><br>
  ${forma_pago}
</div>

<div class="section">
  <strong>TERCERA.- USO DEL SUELO</strong><br>
  El comprador declara conocer las normas de uso del suelo y restricciones urbanísticas aplicables al lote adquirido.
</div>

<div class="section">
  <strong>CUARTA.- TRADICIÓN Y ENTREGA</strong><br>
  La tradición del inmueble se perfeccionará mediante escritura pública y su correspondiente registro.
</div>

<div class="section">
  <strong>QUINTA.- OBLIGACIONES</strong><br>
  El vendedor se obliga a entregar el lote libre de ocupantes, gravámenes y limitaciones no declaradas. El comprador se obliga a pagar el precio pactado en la forma convenida.
</div>

${clausulas_adicionales ? `
<div class="section">
  <strong>CLÁUSULAS ADICIONALES</strong><br>
  ${clausulas_adicionales}
</div>
` : ''}

<div class="section">
  En constancia, firman las partes en ${lugar_firma}, a ${fecha_firma}.
</div>

<div class="firma">
  <div style="display: inline-block; width: 45%; text-align: center;">
    <div class="firma-linea"></div><br>
    <strong>EL VENDEDOR</strong><br>
    ${vendedor_nombre} ${vendedor_apellido}<br>
    ${vendedor_tipo_documento}: ${vendedor_numero_documento}
  </div>
  <div style="display: inline-block; width: 45%; text-align: center; float: right;">
    <div class="firma-linea"></div><br>
    <strong>EL COMPRADOR</strong><br>
    ${comprador_nombre} ${comprador_apellido}<br>
    ${comprador_tipo_documento}: ${comprador_numero_documento}
  </div>
</div>

</body>
</html>
  `;
};
