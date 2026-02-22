import { CirclePlus } from 'lucide-react';

export const PermissionModalFormConfig = {
    moduleTitle: 'Manage Permissions',
    title: 'Create Permission',
    description: 'Fill in the details below to create a new permission.',
    addButton: {
        id: 'add-permission',
        label: 'Add Permission',
        className: 'bg-indigo-700 text-white rounded-lg px-4 py-2 hover:bg-indigo-800 cursor-pointer',
        icon: CirclePlus,
        type: 'button',
        variant: 'default',
    },
    fields: [
        {
            id: 'module',
            key: 'module',
            name: 'module',
            label: 'Module Name',
            type: 'single-select',
            placeholder: 'Enter module name',
            tabIndex: 1,
            autoFocus: true,
            options: [
                { label: 'Categories', value: 'categories', keys: 'categories' },
                { label: 'Products', value: 'products', keys: 'products' },
                { label: 'Users', value: 'users', keys: 'users' },
                { label: 'Roles', value: 'roles', keys: 'roles' },
            ],
        },

        {
            id: 'permission-label',
            key: 'label',
            name: 'label',
            label: 'Permission Label (ex. create, view, edit, delete)',
            type: 'text',
            placeholder: 'Enter permission label',
            autocomplete: 'label',
            tabIndex: 2,
        },
        {
            id: 'description',
            key: 'description',
            name: 'description',
            label: 'Description (optional)',
            type: 'textarea',
            placeholder: 'Enter permission description',
            rows: 3,
            tabIndex: 3,
        },
    ],
    buttons: [
        {
            key: 'cancel',
            type: 'button',
            label: 'Cancel',
            variant: 'ghost',
            className: 'cursor-pointer',
        },
        {
            key: 'submit',
            type: 'submit',
            label: 'Save Permission',
            variant: 'default',
            className: 'cursor-pointer',
        },
    ],
};
