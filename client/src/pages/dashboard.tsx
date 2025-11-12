import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, LogOut, Sparkles, User, Tag, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/confetti";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isApproved] = useState(true); // Mock - will be from API
  const [drawEnabled] = useState(true); // Mock - will be from API
  
  // Mock participant data - will be from API in Task 3
  const [participant] = useState({
    fullName: "Maria Santos",
    codename: "JoyfulStar",
    gender: "Female",
    wishlist: "Bible, Coffee mug, Planner, Scarf",
    pin: localStorage.getItem("currentPin") || "MM-1234",
  });

  const [assignedManito, setAssignedManito] = useState<{
    codename: string;
    wishlist: string;
    gender: string;
  } | null>(null);

  useEffect(() => {
    const pin = localStorage.getItem("currentPin");
    if (!pin || localStorage.getItem("isAdmin") === "true") {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("currentPin");
    localStorage.removeItem("isAdmin");
    setLocation("/login");
    toast({
      title: "Logged out successfully",
    });
  };

  const handleDraw = async () => {
    try {
      // Mock draw - will be connected to backend in Task 3
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockManito = {
        codename: "BrightHeart",
        wishlist: "Devotional book, Tumbler, Socks",
        gender: "Male",
      };

      setAssignedManito(mockManito);
      setHasDrawn(true);
      setShowConfetti(true);

      toast({
        title: "You've drawn your Manito/Manita!",
        description: "Keep it a secret until Christmas!",
      });
    } catch (error) {
      toast({
        title: "Draw Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const parseWishlist = (wishlist: string) => {
    return wishlist.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {showConfetti && <Confetti />}
      
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 h-16 shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" data-testid="icon-header-sparkles" />
            <h1 className="text-lg font-semibold" data-testid="text-header-title">Manito-Manita</h1>
          </div>
          <Button
            variant="ghost"
            className="h-12"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              {isApproved ? (
                <Badge variant="default" className="bg-accent text-accent-foreground" data-testid="badge-status">
                  Approved
                </Badge>
              ) : (
                <Badge variant="secondary" data-testid="badge-status">Pending Approval</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                  <p className="text-base font-medium" data-testid="text-full-name">
                    {participant.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Codename</p>
                  <p className="text-base font-medium" data-testid="text-codename">
                    {participant.codename}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Your Wishlist</p>
                  <ul className="space-y-1" data-testid="list-wishlist">
                    {parseWishlist(participant.wishlist).map((item, index) => (
                      <li key={index} className="text-base flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Your PIN</p>
                  <p className="text-base font-mono font-medium" data-testid="text-pin">
                    {participant.pin}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Draw Card */}
        {isApproved && !hasDrawn && drawEnabled && (
          <Card className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
            <CardHeader className="text-center p-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-primary" data-testid="icon-draw-gift" />
              </div>
              <CardTitle className="text-2xl">Ready to Draw?</CardTitle>
              <CardDescription className="text-base">
                Click below to discover your Manito/Manita
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Button
                onClick={handleDraw}
                size="lg"
                className="w-full h-16 text-lg font-semibold animate-pulse hover:animate-none shadow-lg"
                data-testid="button-draw"
              >
                <Gift className="w-6 h-6 mr-2" />
                Draw My Manito/Manita
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Draw Not Enabled */}
        {isApproved && !hasDrawn && !drawEnabled && (
          <Card className="rounded-2xl bg-gradient-to-br from-muted/50 to-background">
            <CardContent className="py-12 text-center px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-muted-foreground" data-testid="icon-gift-disabled" />
              </div>
              <p className="text-lg font-semibold mb-2" data-testid="text-draw-disabled-title">Drawing Not Yet Open</p>
              <p className="text-muted-foreground" data-testid="text-draw-disabled-desc">
                Wait for the admin to enable the draw
              </p>
            </CardContent>
          </Card>
        )}

        {/* Not Approved */}
        {!isApproved && (
          <Card className="rounded-2xl bg-gradient-to-br from-accent/10 to-background">
            <CardContent className="py-12 text-center px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-accent-foreground" data-testid="icon-pending" />
              </div>
              <p className="text-lg font-semibold mb-2" data-testid="text-pending-title">Waiting for Approval</p>
              <p className="text-muted-foreground" data-testid="text-pending-desc">
                Your registration is pending admin approval
              </p>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {hasDrawn && assignedManito && (
          <Card className="rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-xl">
            <CardHeader className="text-center space-y-4 p-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                <Gift className="w-10 h-10 text-primary" data-testid="icon-result-gift" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-result-title">
                Your {assignedManito.gender === "Male" ? "Manito" : "Manita"} is
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center p-6 bg-background/50 rounded-xl border border-primary/20">
                <p className="text-sm font-medium text-muted-foreground mb-3">Codename</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-assigned-codename">
                  {assignedManito.codename}
                </p>
              </div>

              <div className="p-6 bg-background/50 rounded-xl border">
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  {assignedManito.gender === "Male" ? "His" : "Her"} Wishlist
                </p>
                <ul className="space-y-2" data-testid="list-assigned-wishlist">
                  {parseWishlist(assignedManito.wishlist).map((item, index) => (
                    <li key={index} className="text-base flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-accent/30 rounded-xl border border-accent-border text-center">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Keep it a secret until Christmas reveal day!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
