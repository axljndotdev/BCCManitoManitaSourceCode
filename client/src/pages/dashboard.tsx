
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Gift, LogOut, Sparkles } from "lucide-react";
import Confetti from "@/components/confetti";

interface Participant {
  id: number;
  pin: string;
  fullName: string;
  codename: string;
  gender: string;
  wishlist: string;
  approved: boolean;
  hasDrawn: boolean;
  assignedToPin?: string | null;
  assignedToCodename?: string | null;
}

interface AssignedMatch {
  fullName: string;
  codename: string;
  gender: string;
  wishlist: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [assignedManito, setAssignedManito] = useState<AssignedMatch | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const pin = localStorage.getItem("currentPin");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (!pin || isAdmin) {
      setLocation("/login");
      return;
    }

    fetchData(pin);
  }, [setLocation]);

  const fetchData = async (pin: string) => {
    try {
      setLoading(true);

      // Fetch participant data
      const participantRes = await fetch(`/api/participant/${pin}`);
      const participantData = await participantRes.json();

      if (!participantData.success) {
        throw new Error(participantData.message);
      }

      setParticipant(participantData.participant);

      // If already drawn, fetch the match details
      if (participantData.participant.hasDrawn && participantData.participant.assignedToPin) {
        const matchRes = await fetch(`/api/participant/${participantData.participant.assignedToPin}`);
        const matchData = await matchRes.json();
        
        if (matchData.success) {
          setAssignedManito({
            fullName: matchData.participant.fullName,
            codename: matchData.participant.codename,
            gender: matchData.participant.gender,
            wishlist: matchData.participant.wishlist,
          });
        }
      }

      // Fetch settings
      const settingsRes = await fetch("/api/admin/settings");
      const settingsData = await settingsRes.json();

      if (settingsData.success) {
        setDrawEnabled(settingsData.settings.drawEnabled);
      }
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard",
        variant: "destructive",
      });
      setLocation("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentPin");
    localStorage.removeItem("isAdmin");
    setLocation("/login");
    toast({
      title: "Logged out successfully",
    });
  };

  const handleDraw = async () => {
    if (!participant) return;

    try {
      setDrawing(true);

      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: participant.pin }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setAssignedManito(data.match);
      setParticipant({ ...participant, hasDrawn: true });
      setShowConfetti(true);

      toast({
        title: "You've drawn your Manito/Manita!",
        description: "Keep it a secret until Christmas!",
      });

      // Hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error: any) {
      toast({
        title: "Draw Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setDrawing(false);
    }
  };

  const parseWishlist = (wishlist: string) => {
    return wishlist.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!participant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50">
      {showConfetti && <Confetti />}

      <header className="sticky top-0 z-10 h-16 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-bold">Manito Manita</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>Your Manito Manita information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="font-medium">{participant.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Codename</p>
                <p className="font-medium">{participant.codename}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="font-medium">{participant.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium">
                  {participant.approved ? (
                    <span className="text-green-600">✓ Approved</span>
                  ) : (
                    <span className="text-yellow-600">Pending Approval</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Your Wishlist</p>
              <p className="text-sm">{participant.wishlist}</p>
            </div>
          </CardContent>
        </Card>

        {!participant.approved && (
          <Card className="rounded-2xl border-yellow-200 bg-yellow-50">
            <CardContent className="py-6">
              <p className="text-center text-sm">
                Your registration is pending approval. Please wait for the admin to approve your account.
              </p>
            </CardContent>
          </Card>
        )}

        {participant.approved && !participant.hasDrawn && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Draw Your Manito/Manita</CardTitle>
              <CardDescription className="text-center">
                Click the button below to discover who you'll be giving gifts to!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              {drawEnabled ? (
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg rounded-xl"
                  onClick={handleDraw}
                  disabled={drawing}
                >
                  <Gift className="h-6 w-6 mr-2" />
                  {drawing ? "Drawing..." : "Draw Now!"}
                </Button>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Drawing is currently disabled by the admin.</p>
                  <p className="text-sm">Please check back later.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {participant.hasDrawn && assignedManito && (
          <Card className="rounded-2xl border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-3xl">Your Manito/Manita is...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-primary mb-2">
                  {assignedManito.codename}
                </p>
                <p className="text-muted-foreground">{assignedManito.gender}</p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-3 text-center">Their Wishlist:</p>
                <ul className="space-y-2">
                  {parseWishlist(assignedManito.wishlist).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">🎁</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-center font-medium text-yellow-800">
                  🤫 Remember: Keep this a secret until Christmas!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
