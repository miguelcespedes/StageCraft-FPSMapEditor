import { useEffect, useRef, useState } from 'react';
import { EditorApplication, type EditorViewModel } from '../application/EditorApplication';
import { ThreeArenaSceneAdapter } from '../infrastructure/three/ThreeArenaSceneAdapter';

const initialViewModel: EditorViewModel = {
  inspectorEnabled: false,
  inspectorButtonLabel: 'Activar inspector',
  inspectorMessage: 'Inicializando editor...',
  selectedElementLabel: null,
  selectedElementScreenPosition: null,
};

export function App() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewModel, setViewModel] = useState<EditorViewModel>(initialViewModel);
  const applicationRef = useRef<EditorApplication | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const sceneAdapter = new ThreeArenaSceneAdapter(viewport);
    const application = new EditorApplication(sceneAdapter);
    applicationRef.current = application;

    const unsubscribe = application.subscribe((nextViewModel) => {
      setViewModel(nextViewModel);
    });

    void application.start();

    return () => {
      unsubscribe();
      application.dispose();
      applicationRef.current = null;
    };
  }, []);

  return (
    <div className="editor-shell">
      <div ref={viewportRef} className="editor-shell__viewport" />
      <div className="inspector-ui">
        <button
          className={`inspector-button${viewModel.inspectorEnabled ? ' is-active' : ''}`}
          type="button"
          onClick={() => applicationRef.current?.toggleInspector()}
        >
          {viewModel.inspectorButtonLabel}
        </button>
        <div className="inspector-panel">{viewModel.inspectorMessage}</div>
      </div>
      {viewModel.inspectorEnabled && viewModel.selectedElementLabel && viewModel.selectedElementScreenPosition ? (
        <div
          className="selection-tag"
          style={{
            left: `${viewModel.selectedElementScreenPosition.x}px`,
            top: `${viewModel.selectedElementScreenPosition.y}px`,
          }}
        >
          {viewModel.selectedElementLabel}
        </div>
      ) : null}
    </div>
  );
}
