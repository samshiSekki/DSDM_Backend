import { Controller, Get, Post, Res, Param, NotFoundException, HttpStatus, Body, Query } from "@nestjs/common";
import { ExcelService } from "src/excel/excel.service";
import { ApiResponse, ApiParam, ApiOperation, ApiQuery} from '@nestjs/swagger';
import { ClubService } from "./club.service";
import { ClubDetailDto } from "src/dto/ClubDetailDto.dto";
import { Suggestion } from "./suggestion.entitiy";
import { CreateSuggestionDto, CreateSuggestionByClubDto } from "src/dto/CreateSuggestionDto.dto";
require("dotenv").config();

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
  @ApiQuery({
    name: 'activityDay',
    required: false,
    description: '활동요일별  activityDay=화,목',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: '기간별  period=1: 3개월 이하, period=2: 4-6개월, period=3: 7개월-1년, period=4: 1년 이상',
  })
  @ApiQuery({
    name: 'online',
    required: false,
    description: '온오프라인별  online=1: 온라인, online=2: 오프라인, online=3: 온/오프라인',
  })
  @ApiQuery({
    name: 'recruiting',
    required: false,
    description: '모집중 여부  recruiting=true: 모집중, recruiting=false: 마감',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '대분류 카테고리별 \n category=IT, 광고, 기획, 경제/경영, 광고/마케팅, 건축, 어학, 기타, 발표, 문화/공연, 경영',
  })
  @ApiResponse({status: 200})
  async getClubs(@Query() query){
    return this.clubService.getClubs(query);
  }

  @Get("/clubs/recruit")
  @ApiOperation({summary: '모집중 동아리 조회 API'})
  @ApiResponse({status: 200})
  async getClubsToday(@Res() res){
    const recruitingClub = await this.clubService.getRecruitingClub();
    if(recruitingClub?.length == 0){
      const notRecruit = "모집중인 동아리가 없습니다."
      return res.status(HttpStatus.OK).json({notRecruit});
    }
    return res.status(HttpStatus.OK).json({recruitingClub});
  }

  @Post(process.env.ALL_SUGGEST_POST_URL)
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

  @Post(process.env.CLUB_SUGGEST_POST_URL)
  @ApiOperation({ summary: '동아리 요청사항 전송 API(상세페이지)'})
  @ApiResponse({ status: 201, type: Suggestion })
  async addClubInfo(@Param('id') clubId: number, @Body() createSuggestionByClubDto:CreateSuggestionByClubDto, @Res() res) {
    const suggestion = await this.clubService.addClubInfo(clubId, createSuggestionByClubDto);
    return res.status(HttpStatus.CREATED).json(suggestion);
  }
}
