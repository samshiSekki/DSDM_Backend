import { Club } from "src/clubs/schemas/club.entity";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class RecommendClubDto{

    @ApiProperty({
        type: mongoose.Schema.Types.ObjectId,
        description: '동아리 Object id'
    })
    readonly id:string;

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