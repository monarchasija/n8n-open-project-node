import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class OpenProjectCredentials implements ICredentialType {
    name = 'openProjectApi';
    displayName = 'OpenProject API';
    documentationUrl = 'https://www.openproject.org/docs/api/';
    icon = 'file:icon.svg' as const;

    properties: INodeProperties[] = [
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

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            auth: {
                username: 'apikey',
                password: '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/api/v3/users/me',
            method: 'GET',
        },
    };
}