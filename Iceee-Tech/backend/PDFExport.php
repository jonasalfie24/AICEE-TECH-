<?php

class PDFExport {
    public static function generateRecordPDF($record, $userName) {
        // This is a simple HTML-to-PDF implementation
        // For production, consider using a library like TCPDF or mPDF

        $html = self::generateHTML($record, $userName);
        
        // For simplicity, return HTML that can be converted to PDF client-side
        // or use a library like TCPDF
        return [
            'html' => $html,
            'filename' => 'medical_record_' . $record['id'] . '.pdf'
        ];
    }

    private static function generateHTML($record, $userName) {
        $date = date('M d, Y', strtotime($record['record_date']));
        $approvedDate = date('M d, Y');
        $approvalStatus = ucfirst($record['status']);

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 8.5in; height: 11in; margin: 0 auto; padding: 40px; background: white; }
        .header { border-bottom: 3px solid #7647b5; margin-bottom: 30px; padding-bottom: 20px; }
        .header h1 { color: #7647b5; font-size: 28px; margin-bottom: 5px; }
        .header p { color: #666; font-size: 12px; }
        .section { margin-bottom: 25px; }
        .section-title { color: #7647b5; font-size: 14px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; }
        .field { margin-bottom: 12px; }
        .label { color: #666; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .value { color: #333; font-size: 13px; margin-top: 3px; padding: 8px; background: #f9f9f9; border-radius: 3px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #666; }
        .status-badge { display: inline-block; padding: 5px 12px; background: #7647b5; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Aicee-Tech</h1>
            <p>Medical Records Management System</p>
        </div>

        <div class="section">
            <div class="section-title">Document Information</div>
            <div class="field">
                <div class="label">Document Type</div>
                <div class="value">Medical Record</div>
            </div>
            <div class="field">
                <div class="label">Status</div>
                <div class="value"><span class="status-badge">{$approvalStatus}</span></div>
            </div>
            <div class="field">
                <div class="label">Generated Date</div>
                <div class="value">{$approvedDate}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Student Information</div>
            <div class="field">
                <div class="label">Name</div>
                <div class="value">{$record['student_name']}</div>
            </div>
            <div class="field">
                <div class="label">Strand</div>
                <div class="value">{$record['strand']}</div>
            </div>
            <div class="field">
                <div class="label">Section</div>
                <div class="value">{$record['section']}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Medical Record Details</div>
            <div class="field">
                <div class="label">Record Date</div>
                <div class="value">{$date}</div>
            </div>
            <div class="field">
                <div class="label">Medical Condition</div>
                <div class="value" style="white-space: pre-wrap;">{$record['medical_condition']}</div>
            </div>
        </div>

        <div class="footer">
            <p>This document is officially issued by Aicee-Tech Medical Records Management System</p>
            <p>Record ID: {$record['id']}</p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
