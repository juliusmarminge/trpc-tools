import { TRPCClientErrorLike } from "@trpc/client";
import type { DecorateProcedure, UseTRPCMutationOptions } from "@trpc/react/shared";
import type {
  AnyMutationProcedure,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import { z } from "zod";
import { useZodForm } from "./utils/use-zod-form";
import { type UseFormProps } from "react-hook-form";

type OmitNullish<TType> = Omit<TType, "undefined" | "null">;

type UseTRPCFormProps<
  TProcedure extends AnyMutationProcedure,
  TInput = inferProcedureInput<TProcedure>
> = {
  mutation: DecorateProcedure<TProcedure, "">;
  validator: z.ZodType<TInput>;
  mutationOptions?: UseTRPCMutationOptions<
    TInput,
    TRPCClientErrorLike<TProcedure>,
    inferProcedureOutput<TProcedure>
  >;
  formOptions?: UseFormProps<OmitNullish<TInput>>;
};

export const useTRPCForm = <TProcedure extends AnyMutationProcedure>({
  mutation,
  validator,
  mutationOptions,
  formOptions,
}: UseTRPCFormProps<TProcedure>) => {
  const form = useZodForm({
    validator,
    ...formOptions,
  });

  const actions = mutation.useMutation({
    ...mutationOptions,
    onError(error) {
      console.error("onError", error.message);
      console.log("errors", form.formState.errors);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
    actions.mutate(form.getValues());
  });

  return {
    ...form,
    handleSubmit,
  };
};
