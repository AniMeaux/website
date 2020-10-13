import * as React from "react";
import { Spinner } from "../spinner";

export function FormFog() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <Spinner size="large" />
    </div>
  );
}
