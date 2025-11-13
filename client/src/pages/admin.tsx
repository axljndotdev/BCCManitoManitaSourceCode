import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Gift, LogOut, UserCheck, UserX } from "lucide-react";

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

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pin = localStorage.getItem("currentPin");
    if (pin !== "ADMIN-2025" || localStorage.getItem("isAdmin") !== "true") {
      setLocation("/login");
      return;
    }

    fetchData();
  }, [setLocation]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch participants
      const participantsRes = await fetch("/api/admin/participants");
      const participantsData = await participantsRes.json();

      if (participantsData.success) {
        setParticipants(participantsData.all || []);
      }

      // Fetch settings
      const settingsRes = await fetch("/api/admin/settings");
      const settingsData = await settingsRes.json();

      if (settingsData.success) {
        setDrawEnabled(settingsData.settings.drawEnabled);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
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

  const handleApprove = async (pin: string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "approve" }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchData();
        toast({
          title: "Participant Approved",
          description: "They can now draw when drawing is enabled",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (pin: string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "reject" }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchData();
        toast({
          title: "Participant Rejected",
          description: "Registration has been removed",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleToggleDraw = async (enabled: boolean) => {
    try {
      const res = await fetch("/api/admin/toggle-draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setDrawEnabled(data.drawEnabled);
        toast({
          title: data.drawEnabled ? "Drawing Enabled" : "Drawing Disabled",
          description: data.drawEnabled
            ? "Participants can now draw their Manito/Manita"
            : "Drawing has been disabled",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Toggle Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleResetDraws = async () => {
    if (!confirm("Are you sure you want to reset all draws? This will allow everyone to draw again.")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/reset-draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        await fetchData();
        toast({
          title: "Draws Reset",
          description: "All participants can now draw again",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const pendingParticipants = participants.filter((p) => !p.approved);
  const approvedParticipants = participants.filter((p) => p.approved);
  const drawnCount = participants.filter((p) => p.hasDrawn).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50">
      <header className="sticky top-0 z-10 h-16 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-bold">Manito Manita - Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingParticipants.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedParticipants.length})
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingParticipants.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending registrations
                </CardContent>
              </Card>
            ) : (
              pendingParticipants.map((participant) => (
                <Card key={participant.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{participant.fullName}</CardTitle>
                        <CardDescription>
                          Codename: {participant.codename} • {participant.gender}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(participant.pin)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(participant.pin)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium mb-1">Wishlist:</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.wishlist}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            {approvedParticipants.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No approved participants yet
                </CardContent>
              </Card>
            ) : (
              approvedParticipants.map((participant) => (
                <Card key={participant.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{participant.fullName}</CardTitle>
                        <CardDescription>
                          Codename: {participant.codename} • {participant.gender}
                        </CardDescription>
                      </div>
                      <div className="text-sm">
                        {participant.hasDrawn ? (
                          <span className="text-green-600 font-medium">
                            ✓ Has Drawn
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Not drawn yet
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Wishlist:</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.wishlist}
                        </p>
                      </div>
                      {participant.hasDrawn && participant.assignedToCodename && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Assigned to:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {participant.assignedToCodename}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Draw Settings</CardTitle>
                <CardDescription>
                  Control when participants can draw their Manito/Manita
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Drawing</p>
                    <p className="text-sm text-muted-foreground">
                      Allow approved participants to draw
                    </p>
                  </div>
                  <Switch
                    checked={drawEnabled}
                    onCheckedChange={handleToggleDraw}
                    data-testid="switch-draw-enabled"
                  />
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Participants</p>
                        <p className="text-2xl font-bold">{participants.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Have Drawn</p>
                        <p className="text-2xl font-bold">{drawnCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Re-Draw</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Reset all draws to allow participants to draw again
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleResetDraws}
                      className="w-full"
                    >
                      Reset All Draws
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}