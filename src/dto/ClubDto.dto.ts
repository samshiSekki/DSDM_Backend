import { ApiProperty } from "@nestjs/swagger";

export class ClubDto {
    @ApiProperty({
        type: String,
        description: '동아리 이름',
    })
    name: string

    @ApiProperty({
        type: Array,
        description: '동아리 소 카테고리',
    })
    subCategory: string[][] 

    @ApiProperty({
        type: Boolean,
        description: '모집중 여부',
    })
    recruiting: boolean // 모집중 여부
    
    @ApiProperty({
        type: String,
        description: '회비',
    })
    membershipFee: string
    
    @ApiProperty({
        type: Boolean,
        description: '온/오프라인 여부',
    })
    online: number
    
    @ApiProperty({
        type: String,
        description: '활동 기간',
    })
    period: string
    
    @ApiProperty({
        type: String,
        description: '활동 요일',
    })
    activityDay: string

    @ApiProperty({
        type: String,
        description: '모집 절차',
    })
    selectionProcess: string
}