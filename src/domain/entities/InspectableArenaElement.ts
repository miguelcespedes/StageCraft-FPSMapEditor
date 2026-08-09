export interface InspectableArenaElement {
  readonly name: string;
  readonly materialNames: readonly string[];
  readonly screenPosition?: {
    readonly x: number;
    readonly y: number;
  };
}
