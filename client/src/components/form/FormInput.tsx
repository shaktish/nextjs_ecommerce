import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
}

function FormInput<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
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
                <Input
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

export default FormInput;
