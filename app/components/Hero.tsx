import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export function Hero() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-8 py-10">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className="h-32 w-32 cursor-pointer">
            <AvatarImage src="/avatar.jpg" alt="Your Name" />
            <AvatarFallback>YN</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@yourusername</h4>
              <p className="text-sm">
                Full-stack developer passionate about creating meaningful web experiences
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Your Name</h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          A passionate developer crafting beautiful and functional web experiences. Specialized in
          modern web technologies and user-centric design.
        </p>
      </div>

      <div className="flex gap-4">
        <Button size="lg">View Projects</Button>
        <Button size="lg" variant="outline">
          Contact Me
        </Button>
      </div>
    </div>
  );
}
