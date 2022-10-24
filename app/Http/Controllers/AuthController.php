<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' =>  $validator->errors()->toArray()
            ]);
        }

        if(!$token = auth()->attempt($validator->validated())){
            return response()->json([
                'status' => 'error',
                'message' => 'Username or password not recognised.'
            ], 401);
        }
        
        return $this->respondWithToken($token);
    }

    public function me(){
        return response()->json(auth()->user());
    }

    public function logout(Request $request){
        auth()->logout();

        return response()->json([
            'status' => "success",
            'message' => "Successfully logged out"
        ]);
    }

    public function refresh(Request $request){
        return $this->respondWithToken(auth()->refresh());
    }

    protected function respondWithToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);        
    }
}
