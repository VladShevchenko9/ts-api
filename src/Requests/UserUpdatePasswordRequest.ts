import {
    IsDefined,
    IsStrongPassword,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { newPassword, confirmationPassword } = args.object as UserUpdatePasswordRequest;
        return newPassword === confirmationPassword;
    }

    defaultMessage(args: ValidationArguments) {
        return 'New password must match confirmation password.';
    }
}

@ValidatorConstraint({ name: 'newUniquePassword', async: false })
export class NewUniquePasswordConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { oldPassword, newPassword } = args.object as UserUpdatePasswordRequest;
        return oldPassword !== newPassword;
    }

    defaultMessage(args: ValidationArguments) {
        return 'New password must be different from old password.';
    }
}

export class UserUpdatePasswordRequest {
    @IsDefined()
    @IsStrongPassword()
    oldPassword: string | null = null;

    @IsDefined()
    @IsStrongPassword()
    @Validate(PasswordMatchConstraint)
    @Validate(NewUniquePasswordConstraint)
    newPassword: string | null = null;

    @IsDefined()
    @IsStrongPassword()
    confirmationPassword: string | null = null;
}
