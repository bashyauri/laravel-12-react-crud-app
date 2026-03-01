import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { hasPermission } from '@/utils/authorization';
import { usePage } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import InputError from './input-error';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AddButtonProps {
    id: string;
    label: string;
    className: string;
    icon: string;
    type: 'button' | 'submit' | 'reset' | undefined;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | undefined;
    permission?: string; // Optional permission property
}

interface FieldProps {
    id: string;
    key: string;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    autocomplete?: string;
    tabIndex: number;
    autoFocus?: boolean;
    rows?: number;
    accept?: string;
    className?: string;
    options?: { label: string; value: string; key: string }[];
}

interface ButtonProps {
    key: string;
    type: 'button' | 'submit' | 'reset' | undefined;
    label: string;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | undefined;
    className: string;
}
interface Permissions {
    id: number;
    label: string;
    name: string;
    module: string;
    description: string;
}
interface ExtraData {
    [module: string]: Permissions[];
}
interface FieldOptions {
    label: string;
    value: string;
    key: string;
}

interface CustomModalFormProps {
    addButton: AddButtonProps;
    title: string;
    description: string;
    fields: FieldProps[];
    buttons: ButtonProps[];
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (data: any) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'view' | 'edit';
    previewImage?: string | null;
    extraData?: ExtraData;
}

export const CustomModalForm = ({
    addButton,
    title,
    description,
    fields,
    buttons,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    open,
    onOpenChange,
    mode = 'create',
    previewImage,
    extraData,
}: CustomModalFormProps) => {
    const { auth } = usePage().props as any;
    const userRoles = auth?.roles || [];
    const userPermissions = auth?.permissions || [];
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            {/* Button will trigger modal */}
            {addButton.permission && hasPermission(userPermissions, addButton.permission) && (
                <DialogTrigger asChild>
                    <Button type={addButton.type} id={addButton.id} variant={addButton.variant} className={addButton.className}>
                        {addButton.icon && <addButton.icon />} {addButton.label}
                    </Button>
                </DialogTrigger>
            )}

            {/* Dialog content */}
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-[90vh] w-[95%] overflow-y-auto sm:w-auto sm:max-w-[830px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-6">
                        {fields.map((field) => {
                            const isHiddenPassword = field.type === 'password' && mode !== 'create'; // Hide password field in edit mode
                            if (isHiddenPassword) {
                                return null;
                            }
                            return (
                                <div key={field.key} className="grid gap-2">
                                    <Label htmlFor={field.id}>{field.label} </Label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            id={field.id}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            rows={field.rows}
                                            autoComplete={field.autocomplete}
                                            tabIndex={field.tabIndex}
                                            className={field.className}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            value={data[field.name] || ''}
                                            disabled={processing || mode === 'view'}
                                        />
                                    ) : field.type === 'file' ? (
                                        <div className="space-y-2">
                                            {/* Image preview only */}
                                            {mode !== 'create' && previewImage && (
                                                <img src={previewImage} alt={data?.[field.key]} className="h-32 w-32 rounded object-cover" />
                                            )}

                                            {/* File input */}
                                            {mode !== 'view' && (
                                                <Input
                                                    id={field.id}
                                                    name={field.name}
                                                    type="file"
                                                    accept={field.accept}
                                                    tabIndex={field.tabIndex}
                                                    onChange={(e) => setData(field.name, e.target.files ? e.target.files[0] : null)}
                                                    disabled={processing}
                                                />
                                            )}
                                        </div>
                                    ) : field.type === 'single-select' ? (
                                        <>
                                            {/* === DEBUGGING LOGS - remove later === */}
                                            {(() => {
                                                const currentValue = data[field.name];
                                                const currentValueType = typeof currentValue;
                                                const currentValueJSON =
                                                    currentValue !== undefined && currentValue !== null
                                                        ? JSON.stringify(currentValue, null, 2)
                                                        : '— empty / null / undefined —';

                                                const rawOptions = extraData?.[field.key] || [];
                                                const mappedOptions = rawOptions.map((item: any) => ({
                                                    rawId: item.id,
                                                    rawName: item.name,
                                                    rawLabel: item.label,
                                                    generatedKey: item.id,
                                                    generatedValue: item.name, // ← what your code currently uses
                                                    generatedLabel: item.label,
                                                }));
                                            })()}

                                            <Select
                                                // Safety: force string or empty string
                                                value={data[field.name] != null ? String(data[field.name]) : ''}
                                                disabled={processing || mode === 'view'}
                                                onValueChange={(value) => {
                                                    setData(field.name, value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Select ${field.label}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(() => {
                                                        const optionsSource = field.options?.length
                                                            ? field.options
                                                            : (extraData?.[field.key] || []).map((item: any) => ({
                                                                  key: item.id,
                                                                  value: item.name, // ← currently using name
                                                                  label: item.label || item.name || 'Unnamed',
                                                              }));

                                                        return optionsSource.map((option: FieldOptions) => (
                                                            <SelectItem key={option.key} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ));
                                                    })()}
                                                </SelectContent>
                                            </Select>
                                        </>
                                    ) : field.type === 'grouped-checkboxes' ? (
                                        <div className="space-y-2">
                                            {extraData &&
                                                Object.entries(extraData).map(([module, permissions]) => (
                                                    <div key={module} className="mb-4 border-b pb-5">
                                                        <h4 className="text-sm font-bold text-gray-700 capitalize">{module}</h4>
                                                        <div className="ms-4 mt-2 grid grid-cols-3 gap-2 text-xs">
                                                            {permissions.map((permission) => (
                                                                <label className="flex items-center gap-2" key={permission.id}>
                                                                    <input
                                                                        type="checkbox"
                                                                        name={field.name}
                                                                        disabled={processing || mode === 'view'}
                                                                        value={permission.name}
                                                                        checked={(data.permissions ?? []).includes(permission.name)}
                                                                        onChange={(e) => {
                                                                            const value = permission.name;
                                                                            const current = data.permissions || [];

                                                                            if (e.target.checked) {
                                                                                setData('permissions', [...current, value]);
                                                                            } else {
                                                                                setData(
                                                                                    'permissions',
                                                                                    current.filter((permission: string) => permission !== value),
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span>{permission.label}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <Input
                                            id={field.id}
                                            name={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            autoComplete={field.autocomplete}
                                            tabIndex={field.tabIndex}
                                            autoFocus={field.autoFocus}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            value={data[field.name] || ''}
                                            disabled={processing || mode === 'view'}
                                        />
                                    )}

                                    {/* Form Validation error */}
                                    <InputError message={errors?.[field.name]} />
                                </div>
                            );
                        })}
                    </div>
                    <DialogFooter className="flex flex-wrap gap-2 sm:gap-4">
                        {buttons.map((button) => {
                            if (button.key === 'cancel') {
                                return (
                                    <DialogClose asChild key={button.key}>
                                        <Button key={button.key} type={button.type} variant={button.variant} className={button.className}>
                                            {button.label}
                                        </Button>
                                    </DialogClose>
                                );
                            } else if (mode !== 'view') {
                                return (
                                    <Button key={button.key} type={button.type} variant={button.variant} className={button.className}>
                                        {button.label}
                                    </Button>
                                );
                            }
                        })}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
