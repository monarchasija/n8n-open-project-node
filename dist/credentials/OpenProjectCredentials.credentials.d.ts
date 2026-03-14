import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class OpenProjectCredentials implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: "file:icon.svg";
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
