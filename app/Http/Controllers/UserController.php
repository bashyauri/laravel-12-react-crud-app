<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $users = User::with('roles')->latest()->paginate(10);

        $roles = Role::get();
        return Inertia::render('users/index',[
            'users' => $users,
            'roles' => $roles,
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
    public function store(UserRequest $request)
    {
       $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
        ]);
        if($user){
            $user->syncRoles($request->validated('roles'));
             return redirect()->route('users.index')->with('success', 'User created with roles successfully.');

        }
            return redirect()->route('users.index')->with('error', 'Failed to create user.');


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
    public function update(UserRequest $request, User $user)
    {
       if($user){
          $user->update([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
        ]);
        $user->syncRoles($request->validated('roles'));
         return redirect()->route('users.index')->with('success', 'User updated with roles successfully.');

       }

            return redirect()->back()->with('error', 'Failed to update user.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
