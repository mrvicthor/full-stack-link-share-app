import { useState } from "react";
import { CreateLinkSchema, createSchema } from "@/schemas";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue } from "./ui/select";

const FormBoard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreateLinkSchema>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      links: [
        {
          platform: "",
          url: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });
  return (
    <div>
      <div className="pt-8 px-6">
        <h1 className="font-bold text-2xl">Customize your links</h1>
        <p className="text-[#737373] opacity-80 text-sm mt-4">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
        <Button
          className="mt-6 w-full border-[#633cff] border bg-white text-[#633cff] font-bold hover:bg-[#EFEBFF]"
          onClick={() => {
            setIsOpen(true);
            if (isOpen) append({ platform: "", url: "" });
          }}
        >
          + Add new link
        </Button>
      </div>
      <Form {...form}>
        <form>
          {fields.map((item, index) => (
            <div key={item.id}>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#737373]">
                    = Link #{index + 1}
                  </span>
                </div>
                <span
                  role="button"
                  className="block hover:cursor-pointer text-[#737373] opacity-50"
                  onClick={() => remove(index)}
                >
                  Remove
                </span>
              </div>
              <FormField
                control={form.control}
                name={`links.${index}.platform` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="GitHub" />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          ))}

          <hr />
          <Button>Save</Button>
        </form>
      </Form>
    </div>
  );
};

export default FormBoard;
