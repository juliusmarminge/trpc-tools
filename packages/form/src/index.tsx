import type { AnyMutationProcedure } from "@trpc/server";
import { useCallback, useMemo, useRef, useState } from "react";
import { SafeParseReturnType, z } from "zod";
import { createFlatProxy, createRecursiveProxy } from "./proxy";
import { UseTRPCFormProps, UseTRPCFormResult } from "./types";

function parseOptions<TProcedure extends AnyMutationProcedure>(
  opts: UseTRPCFormProps<TProcedure>,
) {
  return {
    ...opts,
    validateOn: opts.validateOn ?? ["submit", "change"],
    preventDefault: opts.preventDefault ?? true,
  };
}

function parseForm<TData>(form: HTMLFormElement, schema: z.ZodType<TData>) {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries());
  return schema.safeParse(entries);
}

export function useTRPCForm<TProcedure extends AnyMutationProcedure>(
  props: UseTRPCFormProps<TProcedure>,
) {
  type TValidation = SafeParseReturnType<
    TProcedure["_def"]["_input_in"],
    TProcedure["_def"]["_input_out"]
  >;
  const opts = parseOptions(props);

  const formRef = useRef<HTMLFormElement>();

  const actions = opts.mutation.useMutation({
    ...opts,
    onSuccess: (...args) => {
      formRef.current?.reset();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      opts.onSuccess?.(...args);
    },
  });
  // const { path: formNamespace } = actions.trpc;

  const [validation, setValidation] = useState<TValidation | null>(null);

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
      if (!formState.success) return e.preventDefault();

      if (opts.preventDefault) e.preventDefault();
      opts.onSubmit?.({
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

  return useMemo(
    () =>
      createFlatProxy<UseTRPCFormResult<TProcedure>>((key) => {
        if (key === "form") return formRef.current;
        if (key === "ref") return callbackRef;
        if (key === "validate") return validate;
        if (key === "validation") return validation;

        return createRecursiveProxy(($path, args) => {
          const fullPath = [key, ...$path];
          const lastArg = fullPath.pop();

          if (lastArg === "name" || lastArg === "id") {
            return `${fullPath.join(".")}`;
          }

          if (lastArg === "error") {
            const errors = !validation?.success ? validation?.error : undefined;
            const error = errors?.issues.find(
              (e) => JSON.stringify(e.path) === JSON.stringify(fullPath),
            );

            if (typeof args[0] === "function") {
              if (error) return args[0](error);
              return null;
            }

            return error ?? null;
          }
        });
      }),
    [callbackRef, validate, validation],
  );
}
