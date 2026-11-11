# SISGEDO · ISTP Argentina

Aplicación académica para registrar y consultar expedientes, revisar sus movimientos y actualizar el área responsable.

## Inicio

1. Abre esta carpeta en Visual Studio Code.
2. Abre el archivo index.html con Live Server, o ejecuta node servir.cjs y entra a http://127.0.0.1:8765/.
3. Ingresa con las credenciales compartidas por chat. El expediente EXP-2026-00128 sirve para probar la consulta inicial.

## Pantallas

| Archivo HTML | Archivo JavaScript | Función |
| --- | --- | --- |
| 01_login.html | js/login.js | Inicio de sesión y selección de perfil |
| 02_panel.html | js/panel.js | Indicadores, distribución por estado y actividad reciente |
| 03_registrar.html | js/registro.js | Registro de expedientes y asignación de código |
| 04_documentos.html | js/documentos.js | Búsqueda, filtros y exportación CSV |
| 05_seguimiento.html | js/seguimiento.js | Consulta de un expediente y su historial |
| 06_detalle.html | js/detalle.js | Ficha y actualización de estado o área |

Los estilos están en css/estilos.css. Las utilidades y los datos iniciales están en js/app.js. Los recursos gráficos se guardan en img/.

## Alcance académico

El inicio de sesión se simula en el navegador. Los cambios se guardan en el navegador actual para la misma dirección local. Utiliza expedientes ficticios en la presentación.

## Recorrido para la sustentación

Registra un expediente, abre su ficha, cambia su estado y busca su código en Seguimiento. Luego filtra el listado por el nuevo estado y exporta el resultado.
