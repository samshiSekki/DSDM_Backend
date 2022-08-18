import { ApiProperty } from "@nestjs/swagger";

export class RecommendClubDto{

    @ApiProperty({
        type: Number,
        description: '동아리 Id'
    })
    readonly clubId:number;

    @ApiProperty({
        type: String,
        description: '동아리 이름'
    })
    readonly name:string;

    @ApiProperty({
        type: String,
        description: '동아리 로고 URL'
    })
    readonly logoUrl:string;

}