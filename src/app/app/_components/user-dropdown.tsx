'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LockClosedIcon,
  MixerVerticalIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

type MainSidebarProps = {
  user: Session['user']
}

export function UserDropdown({ user }: MainSidebarProps) {
  if (!user) return

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 flex items-center justify-between w-full !px-0 space-x-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-1 flex-1 text-left">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* item */}
          <DropdownMenuItem className="cursor-pointer">
            <MixerVerticalIcon className="mr-3" /> Configurações
          </DropdownMenuItem>
          {/* item */}
          <DropdownMenuItem className="cursor-pointer">
            {' '}
            <RocketIcon className="mr-3" />
            Upgrade
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <LockClosedIcon className="mr-3" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
