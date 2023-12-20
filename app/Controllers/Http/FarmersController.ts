import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import StoreFarmerValidator from 'App/Validators/StoreFarmerValidator'
import UpdateFarmerValidator from 'App/Validators/UpdateFarmerValidator'
import FarmerConverter from 'App/Converters/FarmerConverter'
import FarmerService from 'App/Services/FarmerService'
import { FarmerData } from 'App/Interfaces/FarmerData'
import FarmValidator from 'App/Validators/FarmValidator'

const VALIDATE_FARMER_ERROR = 'An error occurred while validating Farmer.'
const CREATE_FARM_ERROR = 'An error occurred while creating Farmer.'
const FARMER_NOT_FOUND = 'Farmer not found.'
const LIST_FARMER_SUCESS = 'Listing Farmer completed successfully'
const LIST_FARM_ERROR = 'Error when listing Farmers.'
const FARMER_CREATED_WITH_SUCCESS = 'Farmer successfully created'
const FARMER_UPDATED_WITH_SUCCESS = 'Farmer successfully updated'
const FARMER_DELETED_WITH_SUCCESS = 'Farmer successfully deleted.'
const DELETE_FARMER_ERROR = 'Error when deleting Farmer'
const FARMER_NOT_FOUND_OR_DELETE_ERROR = 'Farmer not found or error deleting.'

export default class FarmersController {
  private farmerService = new FarmerService()

  public async index({ response }: HttpContextContract) {
    try {
      const farmers = await this.farmerService.findAllFarmers()
      const formattedResponse = farmers.map(FarmerConverter.toResponse)

      Logger.info(LIST_FARMER_SUCESS)

      return response.ok(formattedResponse)
    } catch (error) {
      return response.notFound({ message: LIST_FARM_ERROR })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const farmer = await this.farmerService.findFarmerById(params.id)
      return response.ok(FarmerConverter.toResponse(farmer))
    } catch (error) {
      return response.notFound({ message: FARMER_NOT_FOUND })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const validatedData: FarmerData = (await request.validate(StoreFarmerValidator)) as FarmerData
      await FarmValidator.validateFarm(validatedData.farm)

      const farmer = await this.farmerService.createFarmer(validatedData)

      const farmFarmerFormatted = FarmerConverter.toResponse(farmer)
      Logger.info(`${FARMER_CREATED_WITH_SUCCESS}: ${farmer.id}`)
      return response.created(farmFarmerFormatted)
    } catch (error) {
      Logger.error(error)
      return (
        this.formatError(error, VALIDATE_FARMER_ERROR) ||
        response.internalServerError({ message: CREATE_FARM_ERROR })
      )
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const validatedData: FarmerData = (await request.validate(
        UpdateFarmerValidator
      )) as FarmerData
      await FarmValidator.validateFarm(validatedData.farm)

      const farmer = await this.farmerService.updateFarmer(params.id, validatedData)

      Logger.info(`${FARMER_UPDATED_WITH_SUCCESS}: ${farmer.id}`)
      return response.ok(
        FarmerConverter.toResponse(await this.farmerService.findFarmerById(farmer.id))
      )
    } catch (error) {
      Logger.error(error)
      return (
        this.formatError(error, VALIDATE_FARMER_ERROR) ||
        response.internalServerError({ message: FARMER_NOT_FOUND })
      )
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const farm = await this.farmerService.findFarmerById(params.id)
      await this.farmerService.deleteFarmer(farm)

      Logger.info(`${FARMER_DELETED_WITH_SUCCESS}: ${params.id}`)
      return response.ok({ message: FARMER_DELETED_WITH_SUCCESS })
    } catch (error) {
      Logger.error(`${DELETE_FARMER_ERROR} ${params.id}: `, error)
      return response.notFound({ message: FARMER_NOT_FOUND_OR_DELETE_ERROR })
    }
  }

  private formatError(error: any, message: string) {
    if (Array.isArray(error) || error.messages) {
      const validationErrors = Array.isArray(error) ? error : error.messages
      return {
        message: message,
        error: validationErrors,
      }
    }

    return null
  }
}
