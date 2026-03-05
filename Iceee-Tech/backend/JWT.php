<?php

class JWT {
    public static function encode($payload, $secret = JWT_SECRET) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        $payload = json_encode($payload);

        $base64Header = self::base64Encode($header);
        $base64Payload = self::base64Encode($payload);

        $signature = hash_hmac(
            'sha256',
            $base64Header . '.' . $base64Payload,
            $secret,
            true
        );

        $base64Signature = self::base64Encode($signature);

        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }

    public static function decode($token, $secret = JWT_SECRET) {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        $header = json_decode(self::base64Decode($parts[0]), true);
        $payload = json_decode(self::base64Decode($parts[1]), true);
        $signature = self::base64Decode($parts[2]);

        $newSignature = hash_hmac(
            'sha256',
            $parts[0] . '.' . $parts[1],
            $secret,
            true
        );

        if (!hash_equals($signature, $newSignature)) {
            throw new Exception('Invalid token signature');
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }

        return $payload;
    }

    private static function base64Encode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64Decode($data) {
        $data = str_replace(['-', '_'], ['+', '/'], $data);
        return base64_decode($data);
    }
}
