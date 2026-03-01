import { CirclePlus } from 'lucide-react';

export const RoleModalFormConfig = {
    moduleTitle: 'Manage Roles',
    title: 'Create Role',
    description: 'Fill in the details below to create a new role.',
    addButton: {
        id: 'add-role',
        label: 'Add Role',
        className: 'bg-indigo-700 text-white rounded-lg px-4 py-2 hover:bg-indigo-800 cursor-pointer',
        icon: CirclePlus,
        type: 'button',
        variant: 'default',
        permission: 'create-role',
    },
    fields: [
        {
            id: 'role-label',
            key: 'label',
            name: 'label',
            label: 'Role Label (ex. admin, editor, viewer)',
            type: 'text',
            placeholder: 'Enter role label',
            autocomplete: 'label',
            tabIndex: 1,
        },
        {
            id: 'description',
            key: 'description',
            name: 'description',
            label: 'Description (optional)',
            type: 'textarea',
            placeholder: 'Enter role description',
            rows: 3,
            tabIndex: 2,
        },
        {
            id: 'permissions',
            key: 'permissions',
            name: 'permissions[]',
            label: 'Permissions (optional)',
            type: 'grouped-checkboxes',
            placeholder: 'Enter role permissions',
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
            label: 'Save Role',
            variant: 'default',
            className: 'cursor-pointer',
        },
    ],
};
