export abstract class BaseValidationError<ErrorCode> extends Error {
  public codes: ErrorCode[];

  constructor(codes: ErrorCode[]) {
    super("ValidationError");
    this.codes = codes;
  }
}
