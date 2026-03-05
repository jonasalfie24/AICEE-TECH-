<?php

class Email {
    private static $headers = [
        'MIME-Version' => '1.0',
        'Content-type' => 'text/html; charset=UTF-8',
        'From' => MAIL_FROM
    ];

    public static function sendAccountApproval($to, $userName, $email) {
        $subject = 'Account Approved - Aicee-Tech Medical Records';
        
        $body = self::getTemplate('account_approved', [
            'userName' => $userName,
            'email' => $email,
            'loginUrl' => APP_URL . '/login'
        ]);

        return self::send($to, $subject, $body);
    }

    public static function sendAccountRejection($to, $userName) {
        $subject = 'Account Review - Aicee-Tech Medical Records';
        
        $body = self::getTemplate('account_rejected', [
            'userName' => $userName,
            'contactUrl' => APP_URL
        ]);

        return self::send($to, $subject, $body);
    }

    public static function sendRecordApproved($to, $userName, $recordId) {
        $subject = 'Medical Record Approved - Aicee-Tech';
        
        $body = self::getTemplate('record_approved', [
            'userName' => $userName,
            'recordId' => $recordId,
            'dashboardUrl' => APP_URL . '/dashboard/records'
        ]);

        return self::send($to, $subject, $body);
    }

    public static function sendRecordRejected($to, $userName) {
        $subject = 'Medical Record Review - Aicee-Tech';
        
        $body = self::getTemplate('record_rejected', [
            'userName' => $userName,
            'dashboardUrl' => APP_URL . '/dashboard/records'
        ]);

        return self::send($to, $subject, $body);
    }

    private static function send($to, $subject, $body) {
        $headers = '';
        foreach (self::$headers as $key => $value) {
            $headers .= $key . ': ' . $value . "\r\n";
        }

        return mail($to, $subject, $body, $headers);
    }

    private static function getTemplate($template, $vars = []) {
        extract($vars);

        ob_start();
        include __DIR__ . "/templates/$template.html";
        return ob_get_clean();
    }
}
