import { CustomModalForm } from '@/components/custom-modal-form';
import { CustomTable } from '@/components/custom-table';
import { CustomToast, toast } from '@/components/custom-toast';
import { RoleModalFormConfig } from '@/config/forms/role-modal-form';
import { RolesTableConfig } from '@/config/tables/roles-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Roles',
        href: '/roles',
    },
];

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

interface RolePagination {
    data: Role[];
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
    roles: RolePagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ roles }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const { permissions } = usePage().props;

    const { data, setData, errors, processing, reset, post } = useForm<{
        label: string;
        description: string;
        permissions: string[];
        _method: string;
    }>({
        label: '',
        description: '',
        permissions: [],
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
        if (mode === 'edit' && selectedRole) {
            data._method = 'PUT';

            post(route('roles.update', selectedRole.id), {
                forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'Role updated successfully.';
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
            post(route('roles.store'), {
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

        setSelectedRole(null);
        reset();
        setModalOpen(false);
    };

    // Handle Modal Toggle
    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setMode('create');
            setSelectedRole(null);
            reset();
        }
    };

    // Open Modal
    const openModal = (mode: 'create' | 'view' | 'edit', role?: Role) => {
        setMode(mode);

        if (role) {
            Object.entries(role).forEach(([key, value]) => {
                if (key !== 'permissions' && Array.isArray(value)) {
                    setData(
                        'permissions',
                        value.map((permission: { name: string }) => permission.name),
                    );
                } else {
                    setData(key as keyof typeof data, value !== null && value !== undefined ? (value as string) : '');
                }
            });

            setSelectedRole(role);
        } else {
            reset();
        }

        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <CustomToast />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Custom Modal Form Component */}
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={RoleModalFormConfig.addButton}
                        title={mode === 'view' ? 'View Role' : mode === 'edit' ? 'Update Role' : RoleModalFormConfig.title}
                        description={RoleModalFormConfig.description}
                        fields={RoleModalFormConfig.fields}
                        buttons={RoleModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        extraData={permissions}
                    />
                </div>

                {/* Custom Table component */}
                <CustomTable
                    columns={RolesTableConfig.columns}
                    actions={RolesTableConfig.actions}
                    data={roles.data}
                    from={roles.from}
                    onDelete={handleDelete}
                    onView={(role) => openModal('view', role)}
                    onEdit={(role) => openModal('edit', role)}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
