export default class FarmValidator {
  public static async validateFarm(data: any) {
    const { totalArea, agriculturalArea, vegetationArea } = data

    if (agriculturalArea + vegetationArea > totalArea) {
      const errorMessages = [
        {
          rule: 'customValidation',
          field: 'agriculturalArea, vegetationArea, totalArea',
          message:
            'A soma da área agrícola e da vegetação não pode ser maior que a área total da fazenda.',
        },
      ]

      throw errorMessages
    }
  }
}
