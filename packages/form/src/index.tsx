import type { AnyMutationProcedure, inferProcedureInput } from "@trpc/server";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { UseTRPCFormProps } from "./types";

function parseOptions<TProcedure extends AnyMutationProcedure>(
  opts: UseTRPCFormProps<TProcedure>,
) {
  return {
    ...opts,
    validateOn: opts.validateOn ?? ["submit", "change"],
  };
}

function parseForm<TData>(form: HTMLFormElement, schema: z.ZodType<TData>) {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries());
  console.log("[TRPCForm parseForm]:", entries);

  return schema.safeParse(entries);
}

export function useTRPCForm<TProcedure extends AnyMutationProcedure>(
  props: UseTRPCFormProps<TProcedure>,
) {
  type TSchema = inferProcedureInput<TProcedure>;
  const opts = parseOptions(props);

  const actions = opts.mutation.useMutation({
    ...opts,
  });
  const { path: _path } = actions.trpc;

  const formRef = useRef<HTMLFormElement>();
  const [validation, setValidation] = useState<TSchema | null>(null);

  const validate = useCallback(() => {
    if (!formRef.current) throw new Error("Error: Form not mounted");
    const res = parseForm(formRef.current, opts.validator);
    setValidation(res);
    return res;
  }, [opts.validator]);

  const handleChange = useCallback(
    (_e: Event) => {
      if (opts.validateOn.includes("change")) {
        validate();
      }
    },
    [validate],
  );

  const handleSubmit = useCallback(
    (e: SubmitEvent) => {
      const formState = validate();
      console.log("[TRPCForm onSubmit]:", formState);
      if (!formState.success) return e.preventDefault();

      opts.onSubmit({
        preventDefault: () => e.preventDefault(),
        target: e.target as HTMLFormElement,
        data: formState.data,
      });
      actions.mutate(formState.data);
    },
    [validate],
  );

  const callbackRef = useCallback(
    (form: HTMLFormElement | null) => {
      if (form === formRef.current) return;
      if (formRef.current) {
        // Remove old event listeners
        formRef.current.removeEventListener("submit", handleSubmit);
        formRef.current.removeEventListener("change", handleChange);
      }

      // Add new event listeners
      if (form && opts.validateOn.includes("submit"))
        form.addEventListener("submit", handleSubmit);
      if (form && opts.validateOn.includes("change"))
        form.addEventListener("change", handleChange);

      formRef.current = form ?? undefined;
    },
    [handleChange, handleSubmit],
  );

  // TODO:
  const fields = {};
  const errors = {};

  return {
    fields,
    errors,
    validate,
    validation,
    ref: callbackRef,
    form: formRef.current,
  };
}
