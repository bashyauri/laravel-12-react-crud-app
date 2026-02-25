<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->latest()->paginate(10);

        $permissions = Permission::get()->groupBy('module');
        return Inertia::render('roles/index',[
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {

        $role =Role::create([
            'label' => $request->validated('label'),
            'name' => Str::slug($request->validated('description')),
            'description' => $request->validated('description'),
        ]);
        if($role){
            $role->syncPermissions($request->validated('permissions'));
            return redirect()->route('roles.index')->with('success', 'Role created successfully.');
        }

        return redirect()->back()->with('error', 'Unable to create role. Please try again.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
            $role->update([
                'label'       => $request->validated('label'),
                'name'        => Str::slug($request->validated('description')),
                'description' => $request->validated('description'),
            ]);

            $role->syncPermissions($request->validated('permissions'));

            return redirect()->route('roles.index')
                ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
       if($role){
         $role->delete();
         return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
        }
        return redirect()->back()->with('error', 'Unable to delete role. Please try again.');


    }
}
