import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rows?: number;
}

function FormTextArea<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  rows,
}: FormInputProps<T>) {
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea
                  rows={rows || 2}
                  placeholder={placeholder ? placeholder : `Enter ${label}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

export default FormTextArea;
