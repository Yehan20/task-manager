<?php

use App\Exceptions\TaskAlreadyCompletedExpection;
use App\Http\Middleware\LogRequestDetailsMiddleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->append(LogRequestDetailsMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // Authetication Expection  Handler
        $exceptions->render(function (AuthenticationException $exception) {
            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 401);
        });

        // Validator Expecption Hanlder
        $exceptions->render(function (ValidationException $exception) {
            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
                'errors' => $exception->errors(),
            ], 422);
        });

        // Record not found exception Handler
        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {

            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Record not found.',
                ], 404);
            }
        });

        // Request Limit Expection handler
        $exceptions->render(function (ThrottleRequestsException $exception) {
            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 429);
        });

        $exceptions->render(function (TaskAlreadyCompletedExpection $exception, Request $request) {

            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 409);
        });

        $exceptions->render(function (AccessDeniedHttpException $exception, Request $request) {

            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 403);
        });

        // Global Exception handler for the unhandld exceptions
        $exceptions->render(function (Request $request, \Exception $exception) {

            Log::error('URL:'.$request->url().'Exception : '.get_class($exception));

            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 500);
        });
    })->create();
