import z from "zod";
import { Form, FormField, FormItem } from "./ui/form";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import Platform from "./Platform";
import { Input } from "./ui/input";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLink, updateLink } from "@/api/auth";
import { toast } from "react-toastify";
import { options } from "@/lib/constants";

const updateSchema = z.object({
  id: z.string(),
  platform: z.string({
    message: "Please select an platform to display.",
  }),
  url: z
    .string({
      message: "Can't be empty.",
    })
    .min(1, { message: "Can't be empty." }),
});

type EditProps = {
  id: string;
  url: string;
  platform: string;
};

const EditForm = ({ id, url, platform }: EditProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      id,
      platform,
      url,
    },
  });

  const { mutate: deleteOne } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      toast.success("Link deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: updateLink,
    onSuccess: () => {
      toast.success("Link updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const onSubmit = (data: z.infer<typeof updateSchema>) => handleUpdate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Platform
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={platform} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <div key={option.id}>
                          <Platform title={option.title} icon={option.icon} />
                          {option.id !== options.length && <hr />}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link" className="text-right">
                    Link
                  </Label>
                  <Input id="link" {...field} className="col-span-3" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => deleteOne(id)}>
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
              className="bg-[#633cff]"
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditForm;
