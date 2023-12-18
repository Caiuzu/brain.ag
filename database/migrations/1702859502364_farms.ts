import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'farms';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('state').notNullable();
      table.string('city').notNullable();
      table.decimal('total_area').notNullable().defaultTo(0);
      table.decimal('agricultural_area').notNullable().defaultTo(0);
      table.decimal('vegetation_area').notNullable().defaultTo(0);

    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
