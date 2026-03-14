"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenProjectCredentials = void 0;
class OpenProjectCredentials {
    constructor() {
        this.name = 'openProjectApi';
        this.displayName = 'OpenProject API';
        this.documentationUrl = 'https://www.openproject.org/docs/api/';
        this.icon = 'file:icon.svg';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your OpenProject API key (found under My Account → Access Tokens)',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://community.openproject.org',
                required: true,
                description: 'The base URL of your OpenProject instance',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                auth: {
                    username: 'apikey',
                    password: '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/v3/users/me',
                method: 'GET',
            },
        };
    }
}
exports.OpenProjectCredentials = OpenProjectCredentials;
//# sourceMappingURL=OpenProjectCredentials.credentials.js.map