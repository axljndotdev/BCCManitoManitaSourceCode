import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { FestiveBackground } from "@/components/festive-background";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      // Mock login - will be connected to backend in Task 3
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Check if admin PIN
      if (data.pin === "ADMIN-2025") {
        localStorage.setItem("currentPin", data.pin);
        localStorage.setItem("isAdmin", "true");
        setLocation("/admin");
        return;
      }

      // Mock participant login
      localStorage.setItem("currentPin", data.pin);
      localStorage.setItem("isAdmin", "false");
      setLocation("/dashboard");

      toast({
        title: "Welcome back!",
        description: "Logged in successfully",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid PIN. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <FestiveBackground />

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles
            className="w-5 h-5 text-primary"
            data-testid="icon-sparkles"
          />
          <span className="text-sm font-medium">BCC Manito-Manita 2025</span>
        </div>
      </div>

      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center space-y-4 p-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <KeyRound
              className="w-10 h-10 text-primary"
              data-testid="icon-key"
            />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Church</CardTitle>
          <CardDescription className="text-base">
            Enter your PIN to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Example: MM-1234"
                        className="h-12 text-center text-lg font-mono tracking-wider"
                        {...field}
                        data-testid="input-pin"
                      />
                    </FormControl>
                    <FormMessage data-testid="error-pin" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12"
                size="lg"
                disabled={form.formState.isSubmitting}
                data-testid="button-login"
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Don't have a PIN?{" "}
                <Link href="/register" data-testid="link-register">
                  <span className="text-primary hover:underline font-medium cursor-pointer">
                    Register here
                  </span>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
