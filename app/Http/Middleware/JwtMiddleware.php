<?php
namespace App\Http\Middleware;


use Closure;
use JWTAuth;
use Exception;
use App\Models\Token;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;


class JwtMiddleware extends BaseMiddleware
{


	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		try {
			$prefix = $request->route()->getPrefix();
        	$path = str_replace($prefix, '', $request->route()->uri);

			$authHeader = $request->header('Authorization');

			
			if($path == '/refresh'){
				$request->headers->set('Authorization', 'Bearer ' . $request->cookie('refreshToken'));
			}

			$user = JWTAuth::parseToken()->authenticate();
 		} catch (Exception $e) {
        	  if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
		    return response()->json(['message' => 'Token is Invalid'], 403);
		  }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
			return response()->json(['message' => 'Token is Expired'], 401);
		  }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenBlacklistedException){
			return response()->json(['message' => 'Token is Blacklisted'], 400);
		  }else{
		        return response()->json(['message' => 'Authorization Token not found'], 404);
		  }
		}

		
		$token_obj = Token::findByValue(auth()->getToken()->get());

		if(!$token_obj){
			return response()->json(['message' => "Token Invalid"], 403);
		}
		
        return $next($request);
	}
}