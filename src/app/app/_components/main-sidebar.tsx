'use client'
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMain,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavHeaderTitle,
  SidebarNavLink,
  SidebarNavMain,
} from '@/components/dashboard/sidebar'
import { HomeIcon, MixerVerticalIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import { UserDropdown } from './user-dropdown'
import { Logo } from '@/components/logo'

export function MainSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarMain className="flex flex-col flex-grow">
        <SidebarNav>
          <SidebarNavMain>
            {/* LINKS */}
            <SidebarNavLink href="/app" active={isActive('/app')}>
              <HomeIcon className="w-3 h-3 mr-3" />
              Tarefas
            </SidebarNavLink>
            <SidebarNavLink
              href="/app/settings"
              active={isActive('/app/settings')}
            >
              <MixerVerticalIcon className="w-3 h-3 mr-3" />
              Configurações
            </SidebarNavLink>
            {/* LINKS */}
          </SidebarNavMain>
        </SidebarNav>

        <SidebarNav className="mt-auto">
          <SidebarNavHeader>
            <SidebarNavHeaderTitle>Links extras</SidebarNavHeaderTitle>
          </SidebarNavHeader>
          <SidebarNavMain>
            {/* LINKS */}
            <SidebarNavLink href="/">Precisa de ajuda?</SidebarNavLink>
            <SidebarNavLink href="/">Site</SidebarNavLink>
            {/* LINKS */}
          </SidebarNavMain>
        </SidebarNav>
      </SidebarMain>

      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  )
}
