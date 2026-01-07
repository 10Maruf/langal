<?php

namespace App\Services;

use App\Services\Agora\RtcTokenBuilder2;

class AgoraService
{
    protected $appId;
    protected $appCertificate;

    public function __construct()
    {
        $this->appId = config('services.agora.app_id');
        $this->appCertificate = config('services.agora.app_certificate');
    }

    /**
     * Generate Agora RTC Token using official Agora Token Builder
     * 
     * @param string $channelName The channel name
     * @param int $uid User ID
     * @param string $role 'publisher' or 'subscriber'
     * @param int $expireTime Token expiry time in seconds
     * @return string The generated token
     */
    public function generateToken(string $channelName, int $uid, string $role = 'publisher', int $expireTime = 3600): string
    {
        if (empty($this->appCertificate) || empty($this->appId)) {
            throw new \Exception('Agora credentials are not configured properly');
        }

        // Convert role string to RtcTokenBuilder2 role constant
        $agoraRole = ($role === 'publisher') 
            ? RtcTokenBuilder2::ROLE_PUBLISHER 
            : RtcTokenBuilder2::ROLE_SUBSCRIBER;

        // Token expire time and privilege expire time (in seconds from now)
        $tokenExpire = $expireTime;
        $privilegeExpire = $expireTime;

        // Build token using official Agora RtcTokenBuilder2
        $token = RtcTokenBuilder2::buildTokenWithUid(
            $this->appId,
            $this->appCertificate,
            $channelName,
            $uid,
            $agoraRole,
            $tokenExpire,
            $privilegeExpire
        );

        if (empty($token)) {
            throw new \Exception('Failed to generate Agora token. Check App ID and Certificate format.');
        }

        return $token;
    }

    /**
     * Validate if a channel name is valid
     */
    public function isValidChannelName(string $channelName): bool
    {
        // Channel name can contain alphanumeric, underscore, and hyphen
        // Length should be 1-64 characters
        return preg_match('/^[a-zA-Z0-9_\-]{1,64}$/', $channelName) === 1;
    }

    /**
     * Generate a unique channel name
     */
    public function generateChannelName(string $prefix = 'consultation'): string
    {
        return $prefix . '_' . uniqid() . '_' . time();
    }

    /**
     * Get App ID for client
     */
    public function getAppId(): string
    {
        return $this->appId ?? '';
    }
}
