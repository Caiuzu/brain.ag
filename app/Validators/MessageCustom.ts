export default class MessagesCustom {
    public messages = {
        // Mensagens de tipos usados em FarmerValidator
        'string': 'The {{ field }} must be a valid string',
        'number': 'The {{ field }} must be a valid number',
        'array': 'The {{ field }} must be a valid array',

        // Mensagens de regras usadas em FarmerValidator
        'required': 'The {{ field }} is required',
        'maxLength': 'The {{ field }} must be up to {{ options.maxLength }} characters long',
        'regex': 'The {{ field }} is in an invalid format',
        'unique': 'The {{ field }} already exists in the database',
        'unsigned': 'The {{ field }} must be a non-negative number',
        'range': 'The {{ field }} must be between {{ options.start }} and {{ options.stop }}',

        // Mensagens adicionais
        'exists': 'The {{ field }} does not exist in our database',
    }
}
