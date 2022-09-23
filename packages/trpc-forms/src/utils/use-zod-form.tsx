import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";

export function useZodForm<TValidator extends z.ZodType>(
  props: UseFormProps<z.input<TValidator>> & {
    schema: TValidator;
  },
) {
  return useForm<z.input<TValidator>>({
    resolver: zodResolver(props.schema),
    ...props,
  });
}
