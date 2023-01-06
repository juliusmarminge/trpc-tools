import { TRPCClientErrorLike } from "@trpc/client";
import {
  DecorateProcedure,
  UseTRPCMutationOptions,
} from "@trpc/react-query/shared";
import {
  AnyMutationProcedure,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import { SafeParseReturnType, ZodIssue, ZodType } from "zod";

export type TRPCFormSubmitEvent<TData> = {
  preventDefault: () => void;
  target: HTMLFormElement;
  data: TData;
};

export type UseTRPCFormProps<
  TProcedure extends AnyMutationProcedure,
  TPath extends string = "",
> = {
  /** Your tRPC mutation */
  mutation: DecorateProcedure<TProcedure, unknown, TPath>;

  /** Your Zod Validator to use for validation */
  validator: ZodType<inferProcedureInput<TProcedure>>;

  /** Called when the form is submitted */
  onSubmit?: (
    event: TRPCFormSubmitEvent<inferProcedureInput<TProcedure>>,
  ) => void;

  /**
   * Whether preventDefault should be called before the onSubmit handler
   * @default true
   **/
  preventDefault?: boolean;

  /**
   * When to validate the form
   * @default ["change", "submit"]
   **/
  validateOn?: ("change" | "submit")[];
} & UseTRPCMutationOptions<
  inferProcedureInput<TProcedure>,
  TRPCClientErrorLike<TProcedure>,
  inferProcedureOutput<TProcedure>
>;

type ErrorGetter = {
  /** Returns the ZodIssue error */
  (): ZodIssue | undefined;
  /** Callback to render an Error message if there's an error  */
  (cb: (err: ZodIssue) => JSX.Element | null): JSX.Element | null;
};

type DecorateField<TSchema extends ZodType> = {
  [TKey in keyof TSchema["_input"]]: TSchema["_input"][TKey] extends object
    ? DecorateField<TSchema["_input"][TKey]>
    : {
        name: () => string;
        id: () => string;
        error: ErrorGetter;
      };
};

export type SafeParseReturn<TProcedure extends AnyMutationProcedure> =
  SafeParseReturnType<
    TProcedure["_def"]["_input_in"],
    TProcedure["_def"]["_input_out"]
  >;

export type UseTRPCFormResult<
  TProcedure extends AnyMutationProcedure,
  TInput = inferProcedureInput<TProcedure>,
> = {
  ref: () => void;
  form: HTMLFormElement | null;
  validate: () => SafeParseReturn<TProcedure>;
  validation: SafeParseReturn<TProcedure> | null;
} & DecorateField<ZodType<TInput>>;
