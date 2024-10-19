## Instalación 🔧
Instala las dependencias con el comando

```
npm install
```

Es necesario crear variables de entorno mediante la elaboración de un archivo .env al mismo nivel que la carpeta src. Este archivo debe completarse con los siguientes campos, los cuales deben modificarse con tus propias credenciales en lugar del valor "X":

```env
MONGO_URL = X # URL de mongo, la que ponemos dentro de mongoose.connect(X)

JWT_NAME_COOKIE = X # Nombre de la cookie donde se comprueba el logueo de un usuario

JWT_SECRET = X # Cadena de caracteres que se utiliza como una clave secreta para firmar el token JSON Web Token

URL_FRONTEND1 = X
URL_FRONTEND2 = X # URLs de los frontends que desees dar permisos de acceso, sin barra lateral final
URL_FRONTEND3 = X

TOKEN_GRAL = X # Cadena de caracteres utilizado como mecanismo de autenticación para asegurar que solamente los usuarios que presenten este token en los encabezados de sus solicitudes puedan acceder al backend. Importante: Su valor tiene que ser el mismo que el de la variable de entorno VITE_ACCESS_TOKEN que ponés en el frontend
```

## Desarrollo 👷

La carpeta de trabajo es `src` y su archivo principal se ubica en [src/app.ts](src/app.ts). Realiza las modificaciones que desees y, cuando estés listo, ejecuta el siguiente comando:

```
npm run build
```

Este comando compilará todos los archivos TypeScript y los guardará en una carpeta `dist`.

Recomiendo eliminar o vaciar la carpeta `dist` antes de ejecutar dicho comando.

## Despliegue 📦

Para ejecutar el proyecto compilado, utiliza el comando:

```
npm run dev
```

Una vez que veas los mensajes "Servidor escuchando en el puerto 8080" (puerto configurado por defecto) y "Base de mongo conectada", podrás comenzar a utilizarlo sin problemas.

Asegúrate de que la parte frontend esté ejecutándose