import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, Folder, LayoutGrid, Lock, Shield, ShoppingBag, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Lock,
        permission: 'access-permissions-module',
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Shield,
        permission: 'access-roles-module',
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        permission: 'access-users-module',
    },
    {
        title: 'Manage Products',
        href: '/products',
        icon: ShoppingBag,
        permission: 'access-products-module',
    },
    {
        title: 'Manage Categories',
        href: '/categories',
        icon: FileText,
        permission: 'access-categories-module',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRoles = auth?.roles || [];
    const userPermissions = auth?.permissions || [];

    const { position } = useLayout();
    const filteredMainNavItems = mainNavItems.filter((item) => {
        if (!item.permission) {
            return true; // No permission required, show the item
        }
        return userPermissions.includes(item.permission); // Check if user has the required permission
    });

    return (
        <Sidebar side={position} collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo position={position} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} position={position} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" position={position} /> */}
                <NavUser position={position} />
            </SidebarFooter>
        </Sidebar>
    );
}
