# App de evaluación (React Native, Expo + TypeScript)

Aplicación pequeña que combina un login ligero con una lista de tareas asociada a cada usuario. Las tareas requieren título, foto y ubicación, y se guardan localmente para que se muestren únicamente al usuario que las creó.

## Requisitos

- Node >= 16
- npm
- Expo (se puede usar con `npx`, no hace falta instalación global)

## Instalación

Desde la carpeta del proyecto ejecuta:

```
npm install
```

## Ejecutar en desarrollo

```
npx expo start
```

Abre el emulador o la app Expo Go para probar la aplicación.

## Qué incluye la app

- Pantalla de login con soporte para usuarios de prueba  
  (por ejemplo `maburto@example.com`, contraseña `123456`).

- Persistencia de sesión con **AsyncStorage**.

- Biblioteca de tareas por usuario, cada una con:
  - título,
  - foto seleccionada desde la galería,
  - ubicación actual obtenida con `expo-location`.

- Acciones principales:
  - crear tarea,
  - marcar como completada o pendiente,
  - eliminar,
  - cerrar sesión y retornar al login.

## Cómo probar (casos clave)

1. Abre la app y autentícate con uno de los usuarios válidos (por ejemplo `faguirre@example.com` o `mdaza@example.com`, contraseña `password123`).
2. En la pantalla de tareas completa el formulario: agrega un título, selecciona una imagen y permite el acceso a la ubicación.
3. Confirma que la nueva tarea aparece con su foto y coordenadas; alterna su estado entre completada/pendiente y elimina alguna para validar el borrado.
4. Cierra sesión y vuelve a iniciar con el mismo usuario; las tareas deben permanecer gracias a AsyncStorage.

## Estructura relevante

- `app/index.tsx` — Login y lógica de redirección.
- `app/home.tsx` — Lista de tareas con creación, marcado, eliminación y logout.
- `components/context/auth-context.tsx` — Controla el estado del usuario y mantiene la sesión usando AsyncStorage.
- `constants/types.ts` — Tipos `User`, `Task` y la ubicación de la tarea.
- `utils/storage.ts` — Helpers para guardar/cargar tareas y sesión del usuario.

## Dependencias clave

- `@react-native-async-storage/async-storage` — Persistencia local de tareas y sesión.
- `expo-image-picker` — Selección de fotos desde la galería.
- `expo-location` — Captura las coordenadas al crear una tarea.

## Notas

- Al ejecutar `npm run lint` se validan las reglas recomendadas por Expo.
- La navegación está construida con Expo Router (un stack con login y home, sin pestañas).

## Capturas de pantalla
### Pantalla de inicio de sesión
<p align="center">
  <img src="./assets/readme/login1.jpeg" width="220" />
  <img src="./assets/readme/login2.jpeg" width="220" />
</p>

### Pantalla de registro
<p align="center">
  <img src="./assets/readme/register.jpeg" width="220" />
  <img src="./assets/readme/register2.jpeg" width="220" />
  <img src="./assets/readme/register3.jpeg" width="220" />
</p>

### Pantalla de inicio - Biblioteca de usuario
<p align="center">
  <img src="./assets/readme/todo.jpeg" width="220" />
  <img src="./assets/readme/todo1.jpeg" width="220" />
</p>

### Pantalla para agregar libro
<p align="center">
  <img src="./assets/readme/add-task1.jpg" width="220" />
  <img src="./assets/readme/add-task2.jpeg" width="220" />
</p>


## Video de Demostración
https://www.youtube.com/watch?v=deHgU_80WHI

## Roles del equipo
- Marcos Aburto: Desarrollo e implementación del CRUD de tareas, integrando las operaciones de creación, lectura, actualización y eliminación mediante la API.
- Felipe Aguirre: Manejo de errores y validaciones en la aplicación; ajuste de la lógica de navegación para saegurar una redirección correcta al login cuando el usuario no cumple los requisitos de autenticación.
- Marcela Daza: Ajustes visuales y de diseño; creación del material de evidencias del proyecto en funcionamiento (capturas y video).

## Uso de IA
Este proyecto contó con el apoyo de herramientas de Inteligencia Artificial (OpenAI ChatGPT y GitHub Copilot) para asistir en la generación de fragmentos de código, acelerar tareas repetitivas de programación, depurar errores y mejorar la redacción de textos.

Todo el desarrollo fue revisado, adaptado y validado manualmente por los integrantes del equipo para asegurar su correcto funcionamiento y coherencia con los requisitos de la evaluación.