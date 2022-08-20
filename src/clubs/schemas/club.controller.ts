import { Controller, Get, Post, Res, Param, NotFoundException, HttpStatus, Body, Query } from "@nestjs/common";
import { ExcelService } from "src/excel/excel.service";
import { ApiResponse, ApiParam, ApiOperation} from '@nestjs/swagger';
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

//   대분류 (IT, 경제/경영 .. ) ?category='뭐시기'&recruiting='true'
// 모집중여부 (모집중, 마감)
// 활동기간  (3개월 6개월 1년)
// 활동 요일 ()
// 온/오프라인 (온/오프라인 , 오프라인, 온라인)
  @Get("/clubs")
  @ApiOperation({summary: '동아리 전체 목록 조회 API'})
  @ApiResponse({status: 200})
  async getClubs(@Query() query){
    // const { category, recruiting, period, activityDay, online } = query;

    return this.clubService.getClubs(query);
  }

  @Get("/clubs/today")
  @ApiOperation({summary: '오늘 마감인 동아리 조회 API'})
  @ApiResponse({status: 200})
  async getClubsToday(@Res() res){
    const todayClub = await this.clubService.getClubsToday();
    // if(todayClub?.length)
    return res.status(HttpStatus.OK).json({todayClub});
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
