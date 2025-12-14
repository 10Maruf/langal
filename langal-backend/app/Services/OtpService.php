<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Send OTP to phone number
     */
    public function sendOtp(string $phone, string $purpose = 'login', ?int $userId = null): array
    {
        try {
            // Generate OTP code
            $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Send SMS (for now just log)
            $smsSent = $this->sendSms($phone, $otpCode);

            if (!$smsSent) {
                return [
                    'success' => false,
                    'message' => 'Failed to send OTP. Please try again.',
                ];
            }

            return [
                'success' => true,
                'message' => 'OTP sent successfully',
                'otp_id' => time(),
                'expires_in' => 5, // minutes
                // For development only - show OTP in response
                'otp_code' => $otpCode,
            ];

        } catch (Exception $e) {
            Log::error('OTP send failed', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send OTP. Please try again.',
            ];
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(string $phone, string $otpCode, string $purpose = 'login'): array
    {
        try {
                // For development: Accept any 6-digit OTP
                if (strlen($otpCode) === 6 && is_numeric($otpCode)) {
                return [
                        'success' => true,
                        'message' => 'OTP verified successfully',
                        'phone' => $phone,
                ];
            }

            return [
                    'success' => false,
                    'message' => 'Invalid OTP code',
            ];

        } catch (Exception $e) {
            Log::error('OTP verification failed', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'OTP verification failed. Please try again.',
            ];
        }
    }

    /**
     * Send SMS (implement actual SMS gateway later)
     */
    private function sendSms(string $phone, string $otpCode): bool
    {
        try {
                // Log the OTP for development
                Log::info('OTP SMS', [
                    'phone' => $phone,
                    'otp' => $otpCode,
                    'message' => "Your Langal Krishi Sahayak verification code is: {$otpCode}. This code will expire in 5 minutes."
                ]);

                return true;

        } catch (Exception $e) {
            Log::error('SMS sending failed', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get OTP status
     */
    public function getOtpStatus(string $phone, string $purpose = 'login'): ?array
    {
        return [
                'phone' => $phone,
                'purpose' => $purpose,
                'status' => 'OTP system active',
        ];
    }
}