import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'MatchValidator' })
class MatchConstraint implements ValidatorConstraintInterface {
    // https://github.com/typestack/class-validator#custom-validation-classes
    validate(value: string, args: ValidationArguments): boolean {
        // The name of the property that will be checked for matching
        const [propertyName] = args.constraints;
        const propertyValue = (args.object as any)[propertyName];
        return value === propertyValue;
    }
}

// This decorator will be used to check whether two fields are identical or not
export default function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string): void => {
        // Ref: node_modules/class-validator/types/register-decorator.d.ts
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions, // Ref: node_modules/class-validator/types/decorator/ValidationOptions.d.ts
            constraints: [property], // The name of the property that will be checked for matching
            validator: MatchConstraint, // The validation logic that will be used to make the check
        });
    };
}
