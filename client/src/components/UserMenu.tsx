import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Settings,
  UserX,
  LogOut,
  ChevronDown,
} from "lucide-react";

const UserMenu = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">
              {user.name}
            </span>
          </div>

          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60"
      >
        <DropdownMenuLabel>
          My Account
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate("/settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/deactivate-account")}
          className="cursor-pointer text-red-500"
        >
          <UserX className="mr-2 h-4 w-4" />
          Deactivate Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;