import { PawPrint } from "lucide-react";

import { GlareCard } from "@/components/ui/glare-card";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <GlareCard className="flex flex-col items-center justify-center">
          <PawPrint className="h-16 w-16 text-white" />
          <p className="text-white font-bold text-xl mt-4">By LiuBin</p>
        </GlareCard>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <PawPrint className="size-4" />
            </div>
            熊熊助手
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
