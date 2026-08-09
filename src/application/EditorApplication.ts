import type { InspectableArenaElement } from '../domain/entities/InspectableArenaElement';
import type { ArenaScenePort } from './ports/ArenaScenePort';

export interface EditorViewModel {
  readonly inspectorEnabled: boolean;
  readonly inspectorButtonLabel: string;
  readonly inspectorMessage: string;
  readonly selectedElementLabel: string | null;
  readonly selectedElementScreenPosition: { x: number; y: number } | null;
}

export class EditorApplication {
  private inspectorEnabled = false;
  private readonly listeners = new Set<(viewModel: EditorViewModel) => void>();

  public constructor(private readonly arenaScene: ArenaScenePort) {}

  public async start(): Promise<void> {
    this.arenaScene.onArenaLoaded(() => {
      this.emit({
        inspectorMessage: 'Arena cargada. Doble clic para reenfocar la camara o activa el inspector para seleccionar piezas.',
        selectedElementLabel: null,
        selectedElementScreenPosition: null,
      });
    });
    this.arenaScene.onArenaElementSelected((element) => {
      this.renderSelection(element);
    });

    this.emit();
    this.arenaScene.initialize();
    await this.arenaScene.loadArena();
  }

  public subscribe(listener: (viewModel: EditorViewModel) => void): () => void {
    this.listeners.add(listener);
    listener(this.getViewModel());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public toggleInspector(): void {
    this.inspectorEnabled = !this.inspectorEnabled;
    this.arenaScene.setInspectorEnabled(this.inspectorEnabled);
    this.emit({
      inspectorMessage: this.inspectorEnabled
        ? 'Inspector activo. Haz clic sobre una pieza para ver su nombre.'
        : 'Inspector desactivado. Doble clic sobre la arena para reenfocar la camara.',
      selectedElementLabel: null,
      selectedElementScreenPosition: null,
    });
  }

  public dispose(): void {
    this.arenaScene.dispose();
  }

  private renderSelection(element: InspectableArenaElement | null): void {
    if (!this.inspectorEnabled) {
      return;
    }

    if (!element) {
      this.emit({
        inspectorMessage: 'No seleccionaste ninguna pieza de la arena.',
        selectedElementLabel: null,
        selectedElementScreenPosition: null,
      });
      return;
    }

    const materials = element.materialNames.length > 0 ? element.materialNames.join(', ') : 'sin material nombrado';
    this.emit({
      inspectorMessage: `Elemento: ${element.name}\nMateriales: ${materials}`,
      selectedElementLabel: element.name,
      selectedElementScreenPosition: element.screenPosition ?? null,
    });
  }

  private emit(partial?: Partial<EditorViewModel>): void {
    const next = partial ? { ...this.getViewModel(), ...partial } : this.getViewModel();
    for (const listener of this.listeners) {
      listener(next);
    }
  }

  private getViewModel(): EditorViewModel {
    return {
      inspectorEnabled: this.inspectorEnabled,
      inspectorButtonLabel: this.inspectorEnabled ? 'Salir del inspector' : 'Activar inspector',
      inspectorMessage: this.inspectorEnabled
        ? 'Inspector activo. Haz clic sobre una pieza para ver su nombre.'
        : 'Inspector desactivado. Doble clic sobre la arena para reenfocar la camara.',
      selectedElementLabel: null,
      selectedElementScreenPosition: null,
    };
  }
}
