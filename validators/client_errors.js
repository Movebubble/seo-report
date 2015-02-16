function ClientErrors(error, result, $, report) {
    if(result.statusCode >= 400 && result.statusCode < 500)
        report.addMessage('ERROR', 'Client error: HTTP ' + result.statusCode);
}

module.exports = ClientErrors;