# Star Wars

Aplicación interactiva en **JavaScript**, desarrollada para gestionar mascotas y sus dueños dentro de una veterinaria, aplicando técnicas modernas de **programación asíncrona** y una **estructura modular clara y mantenible**.

---

## Objetivo

Simular un sistema CRUD para dueños y mascotas con validaciones estrictas, estructura en módulos y flujo controlado por un menú interactivo que opera con `prompt`, `alert` y `console.log`.

---

## Maquetacion Del Proyecto
[hola](https://sites.google.com/view/star-wars-la-pelicula/inicio)
---


## Funcionalidades

### Menú principal (ejecutado desde `main.js`)
1. Registrar nuevo dueño  (callback + delay 1.5s)
2. Registrar nueva mascota  (Promesa + validación + delay 2s)
3. Listar todas las mascotas  (async/await + console.log)
4. Buscar mascota por nombre  (Promesa + delay 1.5s)
5. Actualizar estado de salud  (async/await + delay 1s)
6. Eliminar mascota por nombre  (Promesa + confirmación + delay 2s)
7. Ver mascotas por cédula de dueño  (async/await + delay 2s)
8. Salir del programa 

---

## Validaciones implementadas

- Todos los campos obligatorios deben completarse
- Edad y peso deben ser numéricos y positivos
- Correos válidos y teléfonos numéricos
- Estado de salud restringido a valores permitidos
- Al registrar una mascota, debe vincularse correctamente a un dueño existente

---

##  Tecnologías usadas

- JavaScript ES6+ (sin librerías externas)
- Estructura de módulos con `import/export`
- Flujo con `prompt`, `alert` y `console.log`
- Simulación de asincronía con `setTimeout`, callbacks, Promesas y async/await

---

##  Cómo ejecutar

1. Asegúrate de usar un servidor local (como **Live Server** de VSCode).
2. Abre `index.html`.
3. El menú interactivo aparecerá automáticamente.
4. Sigue las instrucciones del menú vía `prompt()`.

 **Nota:** Abrir directamente con doble clic (`file://`) no funcionará correctamente con módulos (`import/export`).

---

##  Autor

Desarrollado por Juan_Camilo_Rojas_Arenas

---