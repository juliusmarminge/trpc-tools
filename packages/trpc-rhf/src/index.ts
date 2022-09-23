import type {
  DecorateProcedure,
  UseTRPCMutationOptions,
} from "@trpc/react/shared";
import type {
  AnyMutationProcedure,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import React from "react";
import { UseFormProps } from "react-hook-form";
import { z } from "zod";

import { useZodForm } from "./utils/use-zod-form";

export const useTRPCForm = <
  TProcedure extends AnyMutationProcedure,
  TValidator extends z.ZodType,
>(
  mutation: DecorateProcedure<TProcedure>,
  validator: TValidator,
  mutationOpts: UseTRPCMutationOptions<
    inferProcedureInput<TProcedure>,
    any,
    inferProcedureOutput<TProcedure>
  >,
  formOpts: UseFormProps<z.input<TValidator>>,
) => {
  const actions = mutation.useMutation();
  const form = useZodForm(mutation.input);

  const handleSubmit = React.useCallback(async () => {
    await actions.mutate(form.getValues());
  }, []);

  return {
    ...form,
    handleSubmit,
  };
};
