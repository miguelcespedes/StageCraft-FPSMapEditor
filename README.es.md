# StageCraft FPS Map Editor

[English](./README.md) | [Español](./README.es.md)

StageCraft FPS Map Editor es un explorador 3D educativo en navegador para contenido de mapas FPS modulares.

Carga una arena `.obj` + `.mtl` con `Three.js`, ofrece controles de navegacion suaves y permite inspeccionar visualmente piezas individuales dentro de una aplicacion construida con React + TypeScript.

## Vision General

Este proyecto fue creado como un pequeno visor con enfoque educativo para:

- explorar una arena FPS modular en tiempo real
- inspeccionar elementos individuales de la escena por nombre
- estudiar una arquitectura frontend limpia alrededor de un flujo 3D
- construir y desplegar una aplicacion web estatica con assets de produccion

## Caracteristicas

- Carga una arena FPS modular desde `arena.obj` y `arena.mtl`
- Renderiza la escena en el navegador con `Three.js`
- Usa navegacion suave con orbita y reenfoque mediante doble clic
- Incluye modo inspector para seleccionar e identificar piezas de la escena
- Resalta visualmente los elementos 3D seleccionados
- Muestra una etiqueta flotante para el objeto seleccionado
- Genera una carpeta `dist/` lista para despliegue con la app empaquetada y los assets estaticos

## Objetivos Del Proyecto

Este proyecto es educativo.

Su objetivo es servir como referencia practica para estudiar:

- renderizado 3D en navegador
- arquitectura modular en frontend
- integracion de React + TypeScript con `Three.js`
- flujos de inspeccion de escenas para contenido de mapas estilo FPS
- despliegue estatico con GitHub Pages

## Stack Tecnologico

- React
- TypeScript
- Vite
- Three.js

## Estructura Del Proyecto

```text
src/
  application/      Servicios de aplicacion y puertos
  domain/           Tipos del dominio
  infrastructure/   Detalles de implementacion con Three.js
  styles/           Estilos globales
  ui/               Componentes React
public/
  arena.obj
  arena.mtl
```

## Scripts Disponibles

- `npm run dev`: inicia el servidor de desarrollo local
- `npm run build`: genera la build de produccion en `dist/`
- `npm run preview`: previsualiza la build de produccion localmente
- `npm run typecheck`: ejecuta comprobaciones de TypeScript sin generar archivos

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

Generar una build de produccion:

```bash
npm run build
```

Previsualizar la build de produccion:

```bash
npm run preview
```

## Salida De Build

Las builds de produccion se generan en `dist/`.

Ese resultado incluye:

- el `index.html` generado
- los bundles de JavaScript y CSS
- los assets estaticos copiados desde `public/`

## Despliegue

El repositorio incluye un workflow de GitHub Actions para publicar el contenido de `dist/` en GitHub Pages.

Para que el despliegue funcione, el repositorio debe tener GitHub Pages habilitado con `GitHub Actions` como source.

## Licencia Y Uso

Este proyecto es educativo y se puede usar con libertad siempre que se respete la licencia MIT.

Consulta `LICENSE` para mas detalles.

## Documentacion En Ingles

La documentacion principal en ingles esta disponible en `README.md`.
