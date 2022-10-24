<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Token;
use Exception;
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
        $refresh_token_obj = Token::findPairByValue(auth()->getToken()->get());
        auth()->logout();
        auth()->setToken($refresh_token_obj->value)->logout();

        return response()->json([
            'status' => "success",
            'message' => "Successfully logged out"
        ]);
    }

    public function logoutall(Request $request){
        foreach (auth()->user()->token as $token_obj) {
            try {
                auth()->setToken($token_obj->value)->invalidate(true);
            } catch (Exception $e) { }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Successfulle logged out from all devices',
        ]);
    }

    public function refresh(Request $request){
        $access_token = auth()->claims(['xtype' => 'auth'])->refresh(true, true);

        auth()->setToken($access_token);
        return $this->respondWithToken($access_token);
    }

    protected function respondWithToken($access_token){
        $response_array = [
            'access_token' => $access_token,
            'token_type' => 'bearer',
            'access_expires_in' => auth()->factory()->getTTL() * 60,
        ];

        $access_token_obj = Token::create([
            'user_id' => auth()->user()->id,
            'value' => $access_token,
            'jti' => auth()->payload()->get('jti'),
            'type' => auth()->payload()->get('xtype'),
            'payload' => auth()->payload()->toArray(),
        ]);

        $refresh_token = auth()->claims([
            'xtype' => 'refresh',
            'xpair' => auth()->payload()->get('jti')
        ])->setTTL(auth()->factory()->getTTL() * 3)->tokenById(auth()->user()->id);

        $response_array += [
            'refresh_token' => $refresh_token,
            'refresh_expires_in' => auth()->factory()->getTTL() * 60
        ];

        $refresh_token_obj = Token::create([
            'user_id' => auth()->user()->id,
            'value' => $refresh_token,
            'jti' => auth()->setToken($refresh_token)->payload()->get('jti'),
            'type' => auth()->setToken($refresh_token)->payload()->get('xtype'),
            'pair' => $access_token_obj->id,
            'payload' => auth()->setToken($refresh_token)->payload()->toArray(),
        ]);

        $access_token_obj->pair = $refresh_token_obj->id;
        $access_token_obj->save();

        return response()->json($response_array);        
    }
}

