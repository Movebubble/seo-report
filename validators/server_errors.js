function ServerErrors(error, result, $, report) {
    if(result.statusCode >= 500)
        report.addMessage('ERROR', 'Server error: HTTP ' + result.statusCode);
}

module.exports = ServerErrors;