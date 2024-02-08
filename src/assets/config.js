(function (window) {
    window["config"] = window["config"] || {};
    window["config"].ENV = "${ENV}";
    window["config"].AUTH_CLIENT_ID = "${AUTH_CLIENT_ID}";
    window["config"].ISSUER = "${ISSUER}";
    window["config"].SECURE_CONNECT_BASE_URL = "${SECURE_CONNECT_BASE_URL}";
    window["config"].SERVICE_BASE_URL = "${SERVICE_BASE_URL}";
    window["config"].OAUTH_SCOPES = "${OAUTH_SCOPES}";
})(this);
