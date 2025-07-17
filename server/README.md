# Servidor Node.js - Configuración de Logging

## Niveles de Logging

El servidor ahora incluye un sistema de logging configurable que te permite controlar la cantidad de información que se muestra en la consola.

### Niveles disponibles:

- **NONE**: Sin logs (servidor silencioso)
- **ERROR**: Solo errores 
- **INFO**: Información de inicio + errores (por defecto)
- **DEBUG**: Todos los logs (detallado)

### Uso:

#### Ejecutar con nivel por defecto (INFO):
```bash
node server/index.js
```

#### Ejecutar sin logs (modo silencioso):
```bash
LOG_LEVEL=NONE node server/index.js
```

#### Ejecutar solo con errores:
```bash
LOG_LEVEL=ERROR node server/index.js
```

#### Ejecutar con todos los logs (modo debug):
```bash
LOG_LEVEL=DEBUG node server/index.js
```

### Ejemplos de uso común:

**Para desarrollo (ver todo):**
```bash
LOG_LEVEL=DEBUG node server/index.js
```

**Para producción (solo errores):**
```bash
LOG_LEVEL=ERROR node server/index.js
```

**Para testing (sin distracciones):**
```bash
LOG_LEVEL=NONE node server/index.js
```

### En package.json:

Puedes agregar estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "start:quiet": "LOG_LEVEL=NONE node server/index.js",
    "start:debug": "LOG_LEVEL=DEBUG node server/index.js",
    "start:prod": "LOG_LEVEL=ERROR node server/index.js"
  }
}
```

Luego usar:
```bash
npm run start:quiet  # Servidor silencioso
npm run start:debug  # Servidor con todos los logs
npm run start:prod   # Servidor solo con errores
```
