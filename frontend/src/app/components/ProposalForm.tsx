import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog"

import {Input} from "@/app/components/ui/input"
import {Button} from "@/app/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/form";
import {useRegisterProposal} from "@/app/hooks/useRegisterProposal";
import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";

const formSchema = z.object({
    proposal: z.string().min(1),
    description: z.string().min(1)
});


export function ProposalForm() {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const {mutate, isPending, error} = useRegisterProposal();

    const queryClient = useQueryClient();

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            console.log(values);
            console.log("Fetching")

            mutate(
                {description: values.proposal},
                {
                    onSuccess: () => {
                        setOpen(false);
                        console.log("Submitted successfully!");
                        queryClient.invalidateQueries({ queryKey: ['getProposals'] });
                        toast(
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
                        );
                    },
                    onError: (error) => {
                        console.error("Error submitting proposal:", error);
                        toast.error("Failed to submit the form. Please try again.");
                    },
                }
            );

        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Submit proposal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit a new proposal</DialogTitle>
                    <DialogDescription>
                        Submit a proposal here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl  py-10">

                        <FormField
                            name="proposal"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Proposal</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="enter propsal here..."
                                            type="text"
                                            {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="description"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>What's your proposal about ?</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button disabled={isPending}>Submit</Button>
                        <p>{error === null ? error : "No error"}</p>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}