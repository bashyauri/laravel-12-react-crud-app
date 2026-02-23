<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::latest()->paginate(10);
        return inertia('permissions/index',[
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
   public function store(PermissionRequest $request)
{
    $permission = Permission::create([
        'label' => $request->validated('label'),
        'description' => $request->validated('description'),
        'module' => $request->validated('module'),
        'name' => Str::slug($request->validated('label')),
    ]);

   if ($permission) {
                return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
            }

            return redirect()->back()->with('error', 'Unable to create permission. Please try again.');
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
