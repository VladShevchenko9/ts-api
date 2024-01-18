import { AbstractRequest } from './AbstractRequest'

export class UserRequest extends AbstractRequest {
    protected rules: Record<string, string> = {
        'first_name': 'required|string|min:3|max:255',
        'last_name': 'required|string|min:3|max:255',
        'email': 'required|email|max:255',
        'phone_number': 'required|string|max:255',
    };
}
