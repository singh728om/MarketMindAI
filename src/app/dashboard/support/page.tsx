
"use client";

import { useState } from "react";
import { 
  Headphones, 
  Send, 
  Loader2, 
  Mail, 
  MessageSquare, 
  FileQuestion,
  LifeBuoy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast({
        title: "Ticket Created Successfully",
        description: "Your query has been assigned to a support specialist. Reference: #MM-" + Math.floor(Math.random() * 9000 + 1000),
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-1">Customer Support</h1>
        <p className="text-muted-foreground">Get help from our marketplace experts and technical team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-white/5 bg-card shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-white/5 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                  <LifeBuoy size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline">Open a New Ticket</CardTitle>
                  <CardDescription>Describe your issue and we'll get back to you within 2-4 business hours.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSupportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="support-name">Full Name</Label>
                    <Input id="support-name" placeholder="John Doe" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Work Email</Label>
                    <Input id="support-email" type="email" placeholder="john@company.com" required className="rounded-xl h-12" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input id="support-subject" placeholder="e.g. Myntra Onboarding Delay" required className="rounded-xl h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-query">How can we help?</Label>
                  <Textarea 
                    id="support-query" 
                    placeholder="Provide details about your query or the challenge you're facing..." 
                    className="rounded-xl min-h-[150px] bg-background" 
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Request...</>
                  ) : (
                    <><Send className="mr-2 h-5 w-5" /> Submit Support Ticket</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-white/5 bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Quick Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileQuestion size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Knowledge Base</p>
                  <p className="text-xs text-muted-foreground">Browse guides and FAQs for marketplace selling.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Community Forum</p>
                  <p className="text-xs text-muted-foreground">Connect with other brand owners scaling on AI.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Email Support</p>
                  <p className="text-xs text-muted-foreground">Direct access for enterprise level inquiries.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
             <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
               <Zap size={16} /> Pro Tip
             </h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               For faster resolution on onboarding issues, please include your Marketplace Brand ID or Seller Central email in the ticket description.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
