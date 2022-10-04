import { ApiProperty } from "@nestjs/swagger";

export class UpdateClubRecruitDto{

    @ApiProperty({
        type: Number,
        description: '동아리 Id'
    })
    readonly clubId:number;

    @ApiProperty({
        type: String,
        description: '마감 기한',
        example:'2022-10-04'
    })
    readonly deadline:string;

    @ApiProperty({
        type: Boolean,
        description: '모집 여부'
    })
    readonly recruiting:boolean;
}