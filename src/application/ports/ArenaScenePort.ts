import type { InspectableArenaElement } from '../../domain/entities/InspectableArenaElement';

export interface ArenaScenePort {
  initialize(): void;
  loadArena(): Promise<void>;
  setInspectorEnabled(enabled: boolean): void;
  onArenaElementSelected(listener: (element: InspectableArenaElement | null) => void): void;
  onArenaLoaded(listener: () => void): void;
  dispose(): void;
}
