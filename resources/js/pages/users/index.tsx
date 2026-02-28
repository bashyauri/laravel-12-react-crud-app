import { CustomModalForm } from '@/components/custom-modal-form';
import { CustomTable } from '@/components/custom-table';
import { CustomToast, toast } from '@/components/custom-toast';
import { UserModalFormConfig } from '@/config/forms/user-modal-form';
import { UsersTableConfig } from '@/config/tables/users-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/users',
    },
];

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

interface UserPagination {
    data: User[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface FilterProps {
    search: string;
    perPage: string;
}

interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface IndexProps {
    users: UserPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
    roles: Role[];
}

export default function Index({ users, roles }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, setData, errors, processing, reset, post } = useForm<{
        name: string;
        email: string;
        password: string;
        confirm_password: string;
        roles: string;
        _method: string;
    }>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        roles: '',
        _method: 'POST',
    });

    // Handle Delete
    const handleDelete = (route: string) => {
        if (confirm('Are you sure, you want to delete?')) {
            router.delete(route, {
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    if (successMessage) {
                        toast.success(successMessage);
                    }
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to delete permission.';
                    toast.error(errorMessage);
                    closeModal();
                },
            });
        }
    };

    // Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Edit mode
        if (mode === 'edit' && selectedUser) {
            data._method = 'PUT';

            post(route('users.update', selectedUser.id), {
                forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'User updated successfully.';
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;
                    if (errorMessage) {
                        toast.error(errorMessage);
                    }
                },
            });
        } else {
            post(route('users.store'), {
                forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;
                    if (errorMessage) {
                        toast.error(errorMessage);
                    }
                },
            });
        }
    };

    // Closing modal
    const closeModal = () => {
        setMode('create');

        setSelectedUser(null);
        reset();
        setModalOpen(false);
    };

    // Handle Modal Toggle
    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setMode('create');
            setSelectedUser(null);
            reset();
        }
    };

    // Open Modal
    const openModal = (mode: 'create' | 'view' | 'edit', user?: User & { roles?: { name: string }[] }) => {
        setMode(mode);

        if (user) {
            Object.entries(user).forEach(([key, value]) => {
                if (key === 'roles' && Array.isArray(value)) {
                    setData('roles', value.map((role: { name: string }) => role.name).join(','));
                } else {
                    setData(key as keyof typeof data, value !== null && value !== undefined ? (value as string) : '');
                }
            });
            setSelectedUser(user);
        } else {
            reset();
        }

        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <CustomToast />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Custom Modal Form Component */}
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={UserModalFormConfig.addButton}
                        title={mode === 'view' ? 'View User' : mode === 'edit' ? 'Update User' : UserModalFormConfig.title}
                        description={UserModalFormConfig.description}
                        fields={UserModalFormConfig.fields}
                        buttons={UserModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        extraData={{
                            roles: roles, // ← key = 'roles' matches field.key
                        }}
                    />
                </div>

                {/* Custom Table component */}
                <CustomTable
                    columns={UsersTableConfig.columns}
                    actions={UsersTableConfig.actions}
                    data={users.data}
                    from={users.from}
                    onDelete={handleDelete}
                    onView={(user) => openModal('view', user)}
                    onEdit={(user) => openModal('edit', user)}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
