<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.verify', ['except' => ['login', 'register']]);
        $this->middleware('jwt.xauth', ['except' => ['login', 'register', 'refresh']]);
        $this->middleware('jwt.xrefresh', ['only' => ['refresh']]);
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
            ], 422);
        }

        if(!$token = auth()->claims(['xtype' => 'auth'])->attempt($validator->validated())){
            return response()->json([
                'status' => 'error',
                'message' => 'Username or password not recognised.'
            ], 401);
        }
        
        return $this->respondWithToken($token);
    }

    public function register(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
        ]);
 
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->toArray()
            ], 400);
        }

        $user = User::create(array_merge(
            $validator->validated(),
            ['password' => bcrypt($request->password)]
        ));

        $loginRequest = new Request();

        $loginRequest->replace(array(
            'email' => $request->email,        
            'password' => $request->password
        ));
        
        $response = $this->login($request);

        return $response;
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
        $access_token = auth()->claims(['xtype' => 'auth'])->refresh(true, true);

        auth()->setToken($access_token);
        return $this->respondWithToken($access_token);
    }

    protected function respondWithToken($access_token){
        return response()->json([
            'access_token' => $access_token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'refresh_token' => auth()->claims([
                'xtype' => 'refresh',
                'xpair' => auth()->payload()->get('jti')
            ])
            ->setTTL(auth()->factory()->getTTL() * 3)
            ->tokenById(auth()->user()->id),
            'refresh_expires_in' => auth()->factory()->getTTL() * 60
        ]);        
    }
}

