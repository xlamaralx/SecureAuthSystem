import { LayoutDashboard, Menu } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useLayout } from "@/hooks/use-layout";

export function LayoutToggle() {
  const { layout, setLayout } = useLayout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-md">
          {layout === "sidebar" ? (
            <LayoutDashboard className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle layout</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLayout("sidebar")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Sidebar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLayout("topnav")}>
          <Menu className="mr-2 h-4 w-4" />
          <span>Top Navigation</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
