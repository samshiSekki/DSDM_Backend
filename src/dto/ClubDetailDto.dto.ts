import { Club } from "src/clubs/schemas/club.entity";
import { ApiProperty } from "@nestjs/swagger";
import { RecommendClubDto } from "./RecommendClubDto.dto";

export class ClubDetailDto{
    
    @ApiProperty({
        type: [Club],
        description: 'Club 객체 배열',
      })
      Club: Club[];

    @ApiProperty({
        type: [RecommendClubDto],
        description: '추천 Club 객체 배열'
    })
    RecommendClub: RecommendClubDto[];

}