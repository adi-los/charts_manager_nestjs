// import { Controller, Post, Body } from '@nestjs/common';
// import { AppService } from './app.service'; // Adjust the import according to your file structure
// import { DeployParamsDto, VMspecsDto } from './dto/deploy-params.dto';
// @Controller('deploy')
// export class DeployController {
//   constructor(private readonly appService: AppService) {}

//   @Post('all')
//   async deployAll(@Body() params: DeployParamsDto, @Body() specs: VMspecsDto): Promise<{ message: string }> {
//     try {
//       const result = await this.appService.deployAll(params, specs);
//       return { message: result };
//     } catch (error) {
//       throw new Error(`Deployment failed: ${error.message}`);
//     }
//   }
// }


import { Controller, Post, Body } from '@nestjs/common';
import { DeployParamsDto, VMspecsDto } from './dto/deploy-params.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('deploy') // Optional: Tag for organization in Swagger UI
@Controller('deploy')
export class DeployController {
  constructor(private readonly appService: AppService) {}

  @Post('all')
  @ApiOperation({ summary: 'Deploy all charts' })
  @ApiResponse({ status: 200, description: 'All charts deployed successfully' })
  @ApiResponse({ status: 500, description: 'Deployment failed' })
  async deployAll(
    @Body() deployParams: DeployParamsDto,
    @Body() vmSpecs: VMspecsDto
  ): Promise<{ message: string }> {
    try {
      const result = await this.appService.deployAll(deployParams, vmSpecs);
      return { message: result };
    } catch (error) {
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
}

