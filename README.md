# Sala de Juegos - Catriel Gatto

Portal interactivo desarrollado como parte del Trabajo Práctico N°1 de la asignatura **Programación IV**.

---

## 🚀 Características

- **Diseño Neon Cyberpunk**: Interfaz inmersiva con estética retro-futurista y efectos de resplandor.
- **Autenticación Segura**: Gestión de usuarios mediante **Supabase Auth** (registro e inicio de sesión).
- **Navegación Fluida**: SPA (Single Page Application) con enrutamiento dinámico gestionado por **Angular Router**.
- **Responsive**: Diseño adaptable a dispositivos móviles y de escritorio.
- **Efectos Visuales**: Transiciones suaves, animaciones de hover y efectos de partículas (particlexJS).

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Angular](https://angular.io/)
- **Lenguaje**: TypeScript
- **Base de Datos / Auth**: [Supabase](https://supabase.com/)
- **Estilos**: Tailwind CSS, SCSS
- **Animaciones**: [ParticlexJS](https://github.com/VincentGarreau/particles.js/)
- **Iconos**: FontAwesome, Google Fonts (Press Start 2P)

---

## 🏁 Despliegue Local

Para ejecutar el proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd sala-de-juegos
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto (si no existe) o configura las variables en tu entorno:

   ```bash
   # Ejemplo de variables necesarias (configuradas en environment.ts)
   export NGRX_PROJECT_REF='tu-project-ref'
   export NGRX_ANON_KEY='tu-anon-key'
   export NGRX_PROJECT_URL='https://tu-project-ref.supabase.co'
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   El proyecto estará disponible en [http://localhost:4200](http://localhost:4200).

---

## 👥 Autor

**Catriel Gatto**
*Estudiante de Ingeniería en Sistemas - UTN
*Fecha de creación: Abril 2026

---

_Proyecto desarrollado para la cátedra de Programación IV. Todos los derechos reservados._

# salaJuegos_CatrielGatto
