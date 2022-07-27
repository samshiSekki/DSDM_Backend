import { Controller, Get, Post, Res, Param, NotFoundException, HttpStatus, Body } from "@nestjs/common";
import { ExcelService } from "src/excel/excel.service";
import { ApiTags, ApiBody, ApiResponse,ApiCreatedResponse, ApiParam, ApiOperation} from '@nestjs/swagger';
import { ClubService } from "./club.service";
import { Club } from "./club.entity";
import { ClubDetailDto } from "src/dto/ClubDetailDto.dto";
import { Suggestion } from "./suggestion.entitiy";
import { CreateSuggestionDto } from "src/dto/CreateSuggestionDto.dto";

@Controller()
export class ClubController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly clubService: ClubService
    ) {}


  @Get(process.env.EXCEL_ROUTER)
  readExcelFile() {
    this.excelService.readExcelFile();
  }

  @Get('clubs/:id')
  @ApiOperation({ summary: '동아리 상세페이지 조회 API',})
  @ApiResponse({ status: 200, type: ClubDetailDto })
  @ApiParam({
    name: 'id',
    description: '동아리 Id',
  })
  async getClubOne(@Res() res, @Param('id') clubId: string): Promise<any> {
    const result = await this.clubService.getClubOne(clubId);
    const club = result[0]
    const recommendClub = result[1]
    if (!result) {
      throw new NotFoundException('club does not exist!');
    }
    return res.status(HttpStatus.OK).json({club, recommendClub});
  }

  @Post('clubs')
  @ApiOperation({ summary: '동아리 요청사항 전송 API'})
  @ApiResponse({ status: 201, type: Suggestion })
  async addSuggetion(@Body() createSuggestionDto:CreateSuggestionDto, @Res() res) {
    const suggestion = await this.clubService.addSuggestion(createSuggestionDto);
    return res.status(HttpStatus.CREATED).json(suggestion);
  }

  @Get("/clubs")
  getClubs(){
    // this.clubService.getClubs();
  }
}
