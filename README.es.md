# StageCraft FPS Map Editor

[English](./README.md) | [Español](./README.es.md)

StageCraft FPS Map Editor es un proyecto web educativo para explorar e inspeccionar una arena FPS 3D modular desde el navegador.

El proyecto utiliza `React`, `TypeScript`, `Vite` y `Three.js` para cargar una arena en formato `.obj` + `.mtl`, navegar por la escena e inspeccionar visualmente los elementos individuales del mapa.

## Que Hace Este Proyecto

- Carga una arena FPS modular desde `arena.obj` y `arena.mtl`
- Renderiza la escena en el navegador con Three.js
- Proporciona controles suaves para explorar la camara
- Permite inspeccionar elementos de la escena e identificar el nombre de cada pieza
- Resalta visualmente las partes 3D seleccionadas
- Genera una carpeta `dist/` lista para despliegue con la aplicacion y los assets

## Objetivos Del Proyecto

Este proyecto es educativo.

Su objetivo es servir como base para estudiar:

- renderizado 3D en navegador
- arquitectura modular en frontend
- integracion de React + TypeScript con Three.js
- flujos de inspeccion de escenas para contenido de mapas estilo FPS

## Stack Tecnologico

- React
- TypeScript
- Vite
- Three.js

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

## Licencia Y Uso

Este proyecto es educativo y se puede usar con libertad siempre que se respete la licencia MIT.

Consulta `LICENSE` para mas detalles.

## Documentacion En Ingles

La documentacion principal en ingles esta disponible en `README.md`.
