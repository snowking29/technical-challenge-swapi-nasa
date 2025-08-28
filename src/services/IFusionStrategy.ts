export interface IFusionStrategy<T> {
  fetchAndTransform(): Promise<T>;
}
