import { TRPCClientErrorLike } from "@trpc/client";
import type {
  DecorateProcedure,
  UseTRPCMutationOptions,
} from "@trpc/react-query/shared";
import type {
  AnyMutationProcedure,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Wraps useForm with a Zod validator and its inferred type
 */
function useZodForm<TValidator extends z.ZodType>(
  props: UseFormProps<z.input<TValidator>> & {
    validator: TValidator;
  },
) {
  return useForm<z.input<TValidator>>({
    resolver: zodResolver(props.validator),
    ...props,
  });
}
type OmitNullish<TType> = Omit<TType, "undefined" | "null">;

type UseTRPCFormProps<
  TProcedure extends AnyMutationProcedure,
  TInput = inferProcedureInput<TProcedure>,
> = {
  mutation: DecorateProcedure<TProcedure, "", "">;
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
