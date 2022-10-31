export interface ValidationProtocol {
  validate: (input: any) => Error | null;
}
