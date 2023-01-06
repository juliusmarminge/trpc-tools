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
import { ZodType } from "zod";

export type TRPCFormSubmitEvent<TData> = {
  preventDefault: () => void;
  target: HTMLFormElement;
  data: TData;
};

export type UseTRPCFormProps<
  TProcedure extends AnyMutationProcedure,
  TInput = inferProcedureInput<TProcedure>,
> = {
  /** Your tRPC mutation */
  mutation: DecorateProcedure<TProcedure, unknown, "">;

  /** Your Zod Validator to use for validation */
  validator: ZodType<TInput>;

  /** Called when the form is submitted */
  onSubmit: (event: TRPCFormSubmitEvent<TInput>) => void;

  /** When to validate the form */
  validateOn?: ("change" | "submit")[];
} & UseTRPCMutationOptions<
  TInput,
  TRPCClientErrorLike<TProcedure>,
  inferProcedureOutput<TProcedure>
>;
