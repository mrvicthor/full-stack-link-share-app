import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { CreateLinkSchema, createSchema } from "@/schemas";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { options } from "@/lib/constants";
import Platform from "./Platform";
import { Input } from "./ui/input";
import Board from "./Board";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/api/auth";
const FormBoard = () => {
  const queryClient = useQueryClient();
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
  const { mutate: addLink, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      toast.success("Link successfully added...");
      setIsOpen(false);
      form.reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: () => {
      toast.error("Error adding link...");
    },
  });

  const onSubmit = (data: CreateLinkSchema) => addLink(data.links);

  return (
    <div>
      <ToastContainer />
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
        <form
          className="mt-6 relative h-[30rem]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {isOpen ? (
            <div className="space-y-2 overflow-y-scroll max-h-[26rem] overflow-hidden">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="mx-6 px-4 py-4 bg-[#fafafa] rounded-md"
                >
                  <div className="flex justify-between rou">
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
                      <FormItem className="mt-3">
                        <FormLabel className="text-[#333333] font-extralight">
                          Platform
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="hover:border-[#633cff] select-shadow ">
                              <SelectValue placeholder="GitHub" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((option) => (
                              <div key={option.id}>
                                <Platform
                                  title={option.title}
                                  icon={option.icon}
                                />
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`links.${index}.url` as const}
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel className="text-[#333333] font-extralight">
                          Link
                        </FormLabel>
                        <FormControl className="">
                          <Input
                            type="url"
                            className={`${
                              form.formState.errors.links &&
                              form.formState.errors.links[index]?.url &&
                              "border-red-500"
                            } hover:border-[#633cff] select-shadow `}
                            placeholder="🔗  https://github.com/benwright"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.links &&
                          form.formState.errors.links[index]?.url && (
                            <small className="text-[#ea5555] absolute right-4 top-8 text-xs">
                              Can&apos;t be empty
                            </small>
                          )}
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Board />
          )}

          <hr className="absolute bottom-[3.5rem] w-full" />
          <Button
            type="submit"
            disabled={isPending}
            className={`absolute ${
              isOpen ? "bg-[#633cff]" : "bg-[#beadff]"
            } bottom-1 right-4 hover:bg-[#beadff]`}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚪</span>
                adding...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormBoard;
