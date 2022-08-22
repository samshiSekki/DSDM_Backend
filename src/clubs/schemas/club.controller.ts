import { Controller, Get, Post, Res, Param, NotFoundException, HttpStatus, Body, Query } from "@nestjs/common";
import { ExcelService } from "src/excel/excel.service";
import { ApiTags, ApiBody, ApiResponse,ApiCreatedResponse, ApiParam, ApiOperation} from '@nestjs/swagger';
import { ClubService } from "./club.service";
import { ClubDetailDto } from "src/dto/ClubDetailDto.dto";
import { Suggestion } from "./suggestion.entitiy";
import { CreateSuggestionDto } from "src/dto/CreateSuggestionDto.dto";

@Controller()
export class ClubController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly clubService: ClubService
  ) {}


  @Get("/data")
  async readExcelFile() {
    await this.excelService.readExcelFile();
  }

  @Get("/clubs")
  @ApiOperation({summary: '동아리 전체 목록 조회 API'})
  @ApiResponse({status: 200})
  async getClubs(@Query() query){
    return this.clubService.getClubs(query);
  }

  @Post('/clubs')
  @ApiOperation({ summary: '동아리 요청사항 전송 API(메인페이지)'})
  @ApiResponse({ status: 201, type: Suggestion })
  async addSuggetion(@Body() createSuggestionDto:CreateSuggestionDto, @Res() res) {
    const suggestion = await this.clubService.addSuggestion(createSuggestionDto);
    return res.status(HttpStatus.CREATED).json(suggestion);
  }


  @Get('/clubs/:id')
  @ApiOperation({ summary: '동아리 상세페이지 조회 API',})
  @ApiResponse({ status: 200, type: ClubDetailDto })
  @ApiParam({
    name: 'id',
    description: '동아리 Id',
  })
  async getClubOne(@Res() res, @Param('id') clubId: string): Promise<any> {
    const result = await this.clubService.getClubOne(+clubId);
    const club = result[0]
    const recommendClub = result[1]
    if (!result) {
      throw new NotFoundException('club does not exist!');
    }
    return res.status(HttpStatus.OK).json({club, recommendClub});
  }

  @Post('/clubs/:id')
  @ApiOperation({ summary: '동아리 요청사항 전송 API(상세페이지)'})
  @ApiResponse({ status: 201, type: Suggestion })
  async addClubInfo(@Param('id') clubId: string, @Body() createSuggestionDto:CreateSuggestionDto, @Res() res) {
    const suggestion = await this.clubService.addClubInfo(clubId, createSuggestionDto);
    return res.status(HttpStatus.CREATED).json(suggestion);
  }
}
