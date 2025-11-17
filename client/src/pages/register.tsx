import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertParticipantSchema, type InsertParticipant } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { FestiveBackground } from "@/components/festive-background";

export default function Register() {
  const [registeredPin, setRegisteredPin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertParticipant>({
    resolver: zodResolver(insertParticipantSchema),
    defaultValues: {
      fullName: "",
      codename: "",
      gender: "Male",
      wishlist: "",
    },
  });

  const handleCopyPin = () => {
    if (registeredPin) {
      navigator.clipboard.writeText(registeredPin);
      setCopied(true);
      toast({
        title: "PIN Copied!",
        description: "Your PIN has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = async (data: InsertParticipant) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Registration Failed",
          description: result.message || "Please try again",
          variant: "destructive",
        });
        return;
      }

      setRegisteredPin(result.pin);
      
      toast({
        title: "Registration Successful!",
        description: "Save your PIN to login later",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (registeredPin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <FestiveBackground />
        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardHeader className="text-center space-y-4 p-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" data-testid="icon-success" />
            </div>
            <CardTitle className="text-3xl font-bold">You're Registered!</CardTitle>
            <CardDescription className="text-base">
              Save your PIN to login later
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div className="p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent space-y-4">
              <p className="text-sm font-medium text-muted-foreground text-center">
                Your PIN
              </p>
              <div className="text-4xl font-mono font-bold text-center text-primary tracking-wider" data-testid="text-registered-pin">
                {registeredPin}
              </div>
              <Button
                onClick={handleCopyPin}
                variant="outline"
                className="w-full h-12"
                data-testid="button-copy-pin"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy PIN
                  </>
                )}
              </Button>
            </div>

            <div className="p-6 bg-accent/50 rounded-lg border border-accent-border">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Wait for admin approval before you can draw your Manito/Manita
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full h-12" size="lg" data-testid="button-go-to-login">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <FestiveBackground />
      <Card className="w-full max-w-lg rounded-2xl shadow-lg">
        <CardHeader className="text-center space-y-4 p-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <Gift className="w-10 h-10 text-primary" data-testid="icon-gift" />
          </div>
          <CardTitle className="text-3xl font-bold">Join Manito-Manita</CardTitle>
          <CardDescription className="text-base">
            Register for our church Christmas gift exchange
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Juan Dela Cruz"
                        className="h-12"
                        {...field}
                        data-testid="input-full-name"
                      />
                    </FormControl>
                    <FormMessage data-testid="error-full-name" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codename</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="JoyfulStar"
                        className="h-12"
                        {...field}
                        data-testid="input-codename"
                      />
                    </FormControl>
                    <FormMessage data-testid="error-codename" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12" data-testid="select-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage data-testid="error-gender" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wishlist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wishlist</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your wishlist items here (e.g., books, gadgets, accessories, food, anything you'd like!)"
                        className="resize-none min-h-32"
                        rows={4}
                        {...field}
                        data-testid="input-wishlist"
                      />
                    </FormControl>
                    <FormMessage data-testid="error-wishlist" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12"
                size="lg"
                disabled={form.formState.isSubmitting}
                data-testid="button-register"
              >
                {form.formState.isSubmitting ? "Registering..." : "Register"}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Already have a PIN?{" "}
                <Link href="/login" data-testid="link-login">
                  <span className="text-primary hover:underline font-medium cursor-pointer">
                    Login here
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
