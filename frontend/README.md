# README Frontend

## Instalación 🔧

Instala las dependencias con el comando

```bash
npm install
```

Es necesario crear variables de entorno mediante la elaboración de un archivo .env al mismo nivel que la carpeta src. Este archivo debe completarse con los siguientes campos, los cuales deben modificarse con tus propias credenciales en lugar del valor "X".

```env
VITE_BACKEND_URL = X # URL de tu backend sin barra lateral final

VITE_ACCESS_TOKEN = X # Cadena de caracteres utilizado como mecanismo de autenticación para asegurar que solamente los usuarios que presenten este token en los encabezados de sus solicitudes puedan acceder al backend. Importante: Su valor tiene que ser el mismo que el de la variable de entorno TOKEN_GRAL que ponés en el backend
```

## Despliegue 📦

Corre el proyecto con el comando

```bash
npm run dev
```

_Importante_: Asegúrate de que la parte backend esté ejecutándose
