import { schema, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import MessagesCustom from './MessageCustom';

const REGEX = '([0-9]{2}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[\\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[-]?[0-9]{2})';

export default class StoreFarmerValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.maxLength(180)
    ]),
    document: schema.string({}, [
      rules.regex(new RegExp(REGEX)),
      rules.unique({ table: 'farmers', column: 'document' }),
    ]),
    farm: schema.object().members({
      name: schema.string({ trim: true }),
      state: schema.string({ trim: true }),
      city: schema.string({ trim: true }),
      totalArea: schema.number([
        rules.unsigned(),
        rules.range(1, 1000000)
      ]),
      agriculturalArea: schema.number([
        rules.unsigned(),
        rules.range(1, 1000000)
      ]),
      vegetationArea: schema.number([
        rules.unsigned(),
        rules.range(1, 1000000)
      ]),
      crops: schema.array().members(
        schema.number()
      )
    }),

  });

}
