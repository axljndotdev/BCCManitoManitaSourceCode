import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Sparkles, Check, X, Users, Settings2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MockParticipant {
  id: string;
  pin: string;
  fullName: string;
  codename: string;
  gender: string;
  wishlist: string;
  approved: boolean;
  hasDrawn: boolean;
  assignedToCodename?: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  
  // Mock participants data - will be from API in Task 3
  const [participants, setParticipants] = useState<MockParticipant[]>([
    {
      id: "1",
      pin: "MM-1234",
      fullName: "Maria Santos",
      codename: "JoyfulStar",
      gender: "Female",
      wishlist: "Bible, Coffee mug, Planner",
      approved: true,
      hasDrawn: false,
    },
    {
      id: "2",
      pin: "MM-5678",
      fullName: "Juan Dela Cruz",
      codename: "BrightHeart",
      gender: "Male",
      wishlist: "Devotional book, Tumbler, Socks",
      approved: false,
      hasDrawn: false,
    },
    {
      id: "3",
      pin: "MM-9012",
      fullName: "Ana Reyes",
      codename: "HopeBringer",
      gender: "Female",
      wishlist: "Planner, Scarf, Chocolate",
      approved: false,
      hasDrawn: false,
    },
  ]);

  useEffect(() => {
    const pin = localStorage.getItem("currentPin");
    if (pin !== "ADMIN-2025" || localStorage.getItem("isAdmin") !== "true") {
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

  const handleApprove = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setParticipants(prev =>
        prev.map(p => (p.id === id ? { ...p, approved: true } : p))
      );

      toast({
        title: "Participant Approved",
        description: "They can now draw when drawing is enabled",
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setParticipants(prev => prev.filter(p => p.id !== id));

      toast({
        title: "Participant Rejected",
        description: "Registration has been removed",
      });
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleToggleDraw = async (enabled: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDrawEnabled(enabled);

      toast({
        title: enabled ? "Drawing Enabled" : "Drawing Disabled",
        description: enabled
          ? "Approved participants can now draw"
          : "Participants can no longer draw",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const parseWishlist = (wishlist: string) => {
    return wishlist.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  const pendingParticipants = participants.filter(p => !p.approved);
  const approvedParticipants = participants.filter(p => p.approved);
  const drawnCount = participants.filter(p => p.hasDrawn).length;

  const ParticipantCard = ({ participant, showActions }: { participant: MockParticipant; showActions: boolean }) => (
    <Card className="rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate" data-testid={`card-name-${participant.id}`}>
              {participant.fullName}
            </p>
            <p className="text-sm text-muted-foreground" data-testid={`card-codename-${participant.id}`}>
              {participant.codename}
            </p>
          </div>
          {!showActions && (
            <Badge 
              variant={participant.hasDrawn ? "default" : "secondary"}
              className={participant.hasDrawn ? "bg-primary" : ""}
              data-testid={`badge-drawn-${participant.id}`}
            >
              {participant.hasDrawn ? "Drawn" : "Not Drawn"}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="font-normal">
            {participant.gender}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
          </div>
          <ul className="space-y-1 pl-6" data-testid={`card-wishlist-${participant.id}`}>
            {parseWishlist(participant.wishlist).map((item, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              size="lg"
              className="flex-1 h-12"
              onClick={() => handleApprove(participant.id)}
              data-testid={`button-approve-${participant.id}`}
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="flex-1 h-12"
              onClick={() => handleReject(participant.id)}
              data-testid={`button-reject-${participant.id}`}
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 h-16 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" data-testid="icon-header-sparkles" />
            <h1 className="text-lg font-semibold" data-testid="text-header-title">Admin Dashboard</h1>
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

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 p-6">
              <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" data-testid="icon-stat-total" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-2xl font-bold" data-testid="text-total-count">
                {participants.length}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 p-6">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-accent-foreground flex-shrink-0" data-testid="icon-stat-approved" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-2xl font-bold" data-testid="text-approved-count">
                {approvedParticipants.length}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 p-6">
              <CardTitle className="text-sm font-medium">Have Drawn</CardTitle>
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0" data-testid="icon-stat-drawn" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-2xl font-bold" data-testid="text-drawn-count">
                {drawnCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="pending" className="text-sm" data-testid="tab-pending">
              Pending ({pendingParticipants.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-sm" data-testid="tab-approved">
              Approved ({approvedParticipants.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm" data-testid="tab-settings">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve new registrations</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {pendingParticipants.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-xl bg-gradient-to-br from-muted/30 to-background">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" data-testid="icon-empty-pending" />
                    </div>
                    <p className="text-lg font-semibold mb-2" data-testid="text-empty-pending">No pending approvals</p>
                    <p className="text-sm text-muted-foreground">All registrations have been reviewed</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden space-y-4">
                      {pendingParticipants.map((participant) => (
                        <ParticipantCard
                          key={participant.id}
                          participant={participant}
                          showActions={true}
                        />
                      ))}
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Codename</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Wishlist</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingParticipants.map((participant) => (
                            <TableRow key={participant.id}>
                              <TableCell className="font-medium" data-testid={`table-name-${participant.id}`}>
                                {participant.fullName}
                              </TableCell>
                              <TableCell data-testid={`table-codename-${participant.id}`}>
                                {participant.codename}
                              </TableCell>
                              <TableCell>{participant.gender}</TableCell>
                              <TableCell className="max-w-xs truncate" data-testid={`table-wishlist-${participant.id}`}>
                                {participant.wishlist}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="lg"
                                    className="h-12"
                                    onClick={() => handleApprove(participant.id)}
                                    data-testid={`button-approve-${participant.id}`}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="lg"
                                    variant="destructive"
                                    className="h-12"
                                    onClick={() => handleReject(participant.id)}
                                    data-testid={`button-reject-${participant.id}`}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle>Approved Participants</CardTitle>
                <CardDescription>All approved church members</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {approvedParticipants.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-xl bg-gradient-to-br from-accent/10 to-background">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-accent-foreground" data-testid="icon-empty-approved" />
                    </div>
                    <p className="text-lg font-semibold mb-2" data-testid="text-empty-approved">No approved participants yet</p>
                    <p className="text-sm text-muted-foreground">Approve participants from the Pending tab</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden space-y-4">
                      {approvedParticipants.map((participant) => (
                        <ParticipantCard
                          key={participant.id}
                          participant={participant}
                          showActions={false}
                        />
                      ))}
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Codename</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Wishlist</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approvedParticipants.map((participant) => (
                            <TableRow key={participant.id}>
                              <TableCell className="font-medium" data-testid={`table-approved-name-${participant.id}`}>
                                {participant.fullName}
                              </TableCell>
                              <TableCell data-testid={`table-approved-codename-${participant.id}`}>
                                {participant.codename}
                              </TableCell>
                              <TableCell>{participant.gender}</TableCell>
                              <TableCell className="max-w-xs truncate" data-testid={`table-approved-wishlist-${participant.id}`}>
                                {participant.wishlist}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={participant.hasDrawn ? "default" : "secondary"}
                                  className={participant.hasDrawn ? "bg-primary" : ""}
                                  data-testid={`badge-status-${participant.id}`}
                                >
                                  {participant.hasDrawn ? "Drawn" : "Not Drawn"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Settings2 className="w-6 h-6 text-primary" data-testid="icon-settings" />
                  </div>
                  <div>
                    <CardTitle>Drawing Control</CardTitle>
                    <CardDescription>
                      Enable or disable the drawing feature
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="p-6 rounded-xl border bg-gradient-to-br from-muted/30 to-background">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold mb-2">Enable Drawing</p>
                      <p className="text-sm text-muted-foreground">
                        {drawEnabled
                          ? "Approved participants can draw their Manito/Manita"
                          : "Drawing is currently disabled for all participants"}
                      </p>
                    </div>
                    <Switch
                      checked={drawEnabled}
                      onCheckedChange={handleToggleDraw}
                      data-testid="switch-draw-enabled"
                    />
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
