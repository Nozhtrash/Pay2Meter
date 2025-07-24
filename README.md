# Pay2Meter

Pay2Meter es una plataforma para exponer los peores juegos *Pay2Win*. Ofrece opiniones, valoraciones y transparencia para ayudar a los jugadores a tomar decisiones informadas.

## ✨ Características

- **Clasificaciones de la comunidad**: ve qué juegos son los más abusivos según los votos de los usuarios.
- **Opiniones detalladas**: lee reseñas completas de otros jugadores.
- **Sistema de puntos**: gana puntos por participar y canjéalos por recompensas.
- **Investigaciones Profundas**: Análisis detallados y curados por administradores sobre la industria.
- **Perfiles de usuario**: haz un seguimiento de tus contribuciones y tu saldo de puntos.

## 🖼️ Demo

*Aquí puedes añadir capturas de pantalla o GIFs de tu aplicación.*

**(Ejemplo de captura de pantalla de la página de inicio)**
![Página de Inicio](https://placehold.co/800x400.png?text=Pay2Meter+Homepage)

**(Ejemplo de GIF del modal de detalles del juego)**
![Detalles del Juego](https://placehold.co/800x400.png?text=Game+Detail+Modal+GIF)


## 🚀 Tecnologías utilizadas

- **Framework**: Next.js con TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Firestore
- **Autenticación**: Firebase Authentication (correo electrónico/contraseña)
- **Alojamiento**: Firebase App Hosting

## 📦 Cómo empezar

### Requisitos previos

- Node.js (versión 18 o superior)
- npm o yarn
- Una cuenta de Firebase

### Configuración

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/Nozhtrash/Pay2Meter.git
    cd Pay2Meter
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Configura Firebase:**
    - Crea un nuevo proyecto en la [consola de Firebase](https://console.firebase.google.com/).
    - Ve a la **Configuración del proyecto** > **General**.
    - En la sección "Tus aplicaciones", haz clic en el icono web (`</>`) para registrar una nueva aplicación web.
    - Copia el objeto de configuración de Firebase.
    - Crea un archivo `.env.local` en la raíz del proyecto (puedes copiar `.env.example`) y añade tus claves de Firebase.
    - Habilita la autenticación con **correo electrónico/contraseña** en la sección **Authentication** > **Sign-in method** de la consola de Firebase.
    - Configura **Cloud Firestore** en modo de prueba o producción.

### Comandos útiles

-   **Ejecutar en modo de desarrollo:**

    ```bash
    npm run dev
    ```

    Abre [http://localhost:9002](http://localhost:9002) en tu navegador.

-   **Formatear el código:**

    ```bash
    npm run format
    ```

-   **Revisar errores de estilo (linting):**
    ```bash
    npm run lint
    ```
-   **Ejecutar pruebas:**
    ```bash
    npm test
    ```

-   **Construir para producción:**
    ```bash
    npm run build
    ```

### 📜 Reglas de seguridad de Firestore

Es crucial proteger los datos de tu aplicación. Aquí tienes un ejemplo de reglas de seguridad para empezar. Aplícalas en la sección **Firestore Database** > **Reglas** de tu consola de Firebase.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // gameMetadata: lectura pública, escritura solo admin/editor
    match /gameMetadata/{gameId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }

    // users: lectura para perfil propio, actualización solo propio
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }

    // reviews: crear y leer para todos los usuarios logueados
    match /reviews/{reviewId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null;
    }
    
    // deepResearch: lectura pública, escritura solo admin/editor
    match /deepResearch/{researchId} {
        allow read: if true;
        allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }

    // news y freeGames: lectura pública, escritura solo admin/editor
    match /news/{newsId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
    match /freeGames/{gameId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
  }
}
```
>>>>>>> 192c10c (...)
