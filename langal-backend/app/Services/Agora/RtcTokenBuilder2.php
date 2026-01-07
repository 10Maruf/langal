<?php

namespace App\Services\Agora;

class RtcTokenBuilder2
{
    /**
     * RECOMMENDED. Use this role for a voice/video call or a live broadcast.
     */
    const ROLE_PUBLISHER = 1;

    /**
     * Only use this role if your scenario requires authentication for Co-host.
     */
    const ROLE_SUBSCRIBER = 2;

    /**
     * Build the RTC token with uid.
     *
     * @param string $appId The App ID issued to you by Agora.
     * @param string $appCertificate Certificate of the application.
     * @param string $channelName Unique channel name for the AgoraRTC session.
     * @param int|string $uid User ID. A 32-bit unsigned integer.
     * @param int $role ROLE_PUBLISHER or ROLE_SUBSCRIBER.
     * @param int $tokenExpire Token expiry time in seconds.
     * @param int $privilegeExpire Privilege expiry time in seconds.
     * @return string The RTC token.
     */
    public static function buildTokenWithUid($appId, $appCertificate, $channelName, $uid, $role, $tokenExpire, $privilegeExpire = 0)
    {
        return self::buildTokenWithUserAccount($appId, $appCertificate, $channelName, $uid, $role, $tokenExpire, $privilegeExpire);
    }

    /**
     * Build the RTC token with account.
     *
     * @param string $appId The App ID issued to you by Agora.
     * @param string $appCertificate Certificate of the application.
     * @param string $channelName Unique channel name for the AgoraRTC session.
     * @param int|string $account The user's account, max length is 255 Bytes.
     * @param int $role ROLE_PUBLISHER or ROLE_SUBSCRIBER.
     * @param int $tokenExpire Token expiry time in seconds.
     * @param int $privilegeExpire Privilege expiry time in seconds.
     * @return string The RTC token.
     */
    public static function buildTokenWithUserAccount($appId, $appCertificate, $channelName, $account, $role, $tokenExpire, $privilegeExpire = 0)
    {
        $token = new AccessToken2($appId, $appCertificate, $tokenExpire);
        $serviceRtc = new ServiceRtc($channelName, strval($account));

        $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_JOIN_CHANNEL, $privilegeExpire);
        if ($role == self::ROLE_PUBLISHER) {
            $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_PUBLISH_AUDIO_STREAM, $privilegeExpire);
            $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_PUBLISH_VIDEO_STREAM, $privilegeExpire);
            $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_PUBLISH_DATA_STREAM, $privilegeExpire);
        }
        $token->addService($serviceRtc);

        return $token->build();
    }

    /**
     * Generates an RTC token with the specified privilege.
     *
     * @param string $appId The App ID of your Agora project.
     * @param string $appCertificate The App Certificate of your Agora project.
     * @param string $channelName The unique channel name.
     * @param int|string $uid The user ID.
     * @param int $tokenExpire Token expiry time in seconds.
     * @param int $joinChannelPrivilegeExpire Join channel privilege expiry.
     * @param int $pubAudioPrivilegeExpire Publish audio privilege expiry.
     * @param int $pubVideoPrivilegeExpire Publish video privilege expiry.
     * @param int $pubDataStreamPrivilegeExpire Publish data stream privilege expiry.
     * @return string The RTC Token.
     */
    public static function buildTokenWithUidAndPrivilege(
        $appId,
        $appCertificate,
        $channelName,
        $uid,
        $tokenExpire,
        $joinChannelPrivilegeExpire,
        $pubAudioPrivilegeExpire,
        $pubVideoPrivilegeExpire,
        $pubDataStreamPrivilegeExpire
    ) {
        return self::buildTokenWithUserAccountAndPrivilege(
            $appId,
            $appCertificate,
            $channelName,
            $uid,
            $tokenExpire,
            $joinChannelPrivilegeExpire,
            $pubAudioPrivilegeExpire,
            $pubVideoPrivilegeExpire,
            $pubDataStreamPrivilegeExpire
        );
    }

    /**
     * Generates an RTC token with the specified privilege using user account.
     *
     * @param string $appId The App ID of your Agora project.
     * @param string $appCertificate The App Certificate of your Agora project.
     * @param string $channelName The unique channel name.
     * @param int|string $account The user account.
     * @param int $tokenExpire Token expiry time in seconds.
     * @param int $joinChannelPrivilegeExpire Join channel privilege expiry.
     * @param int $pubAudioPrivilegeExpire Publish audio privilege expiry.
     * @param int $pubVideoPrivilegeExpire Publish video privilege expiry.
     * @param int $pubDataStreamPrivilegeExpire Publish data stream privilege expiry.
     * @return string The RTC Token.
     */
    public static function buildTokenWithUserAccountAndPrivilege(
        $appId,
        $appCertificate,
        $channelName,
        $account,
        $tokenExpire,
        $joinChannelPrivilegeExpire,
        $pubAudioPrivilegeExpire,
        $pubVideoPrivilegeExpire,
        $pubDataStreamPrivilegeExpire
    ) {
        $token = new AccessToken2($appId, $appCertificate, $tokenExpire);
        $serviceRtc = new ServiceRtc($channelName, strval($account));

        $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_JOIN_CHANNEL, $joinChannelPrivilegeExpire);
        $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_PUBLISH_AUDIO_STREAM, $pubAudioPrivilegeExpire);
        $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_PUBLISH_VIDEO_STREAM, $pubVideoPrivilegeExpire);
        $serviceRtc->addPrivilege(ServiceRtc::PRIVILEGE_PUBLISH_DATA_STREAM, $pubDataStreamPrivilegeExpire);
        $token->addService($serviceRtc);

        return $token->build();
    }
}
