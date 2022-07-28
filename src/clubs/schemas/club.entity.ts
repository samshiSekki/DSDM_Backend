import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import internal from 'stream';

export type ClubDocument = Club & Document;

@Schema()
export class Club {

  @ApiProperty({
    type: mongoose.Schema.Types.ObjectId,
    description: 'Club Entity의 ObjectId',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: '동아리 이름'
  })
  @Prop()
  name: string

  @ApiProperty({
    type: Array,
    // type: String,
    description: '동아리 카테고리'
  })
  @Prop()
  category: string[]
  // category: string // ** 소분류로도 필터링 가능한지 물어보고 배열로 변경

  @ApiProperty({
    type: String,
    description: '모집대상'
  })
  @Prop()
  target: string

  @ApiProperty({
    type: String,
    description: '모집 중 여부'
  })
  @Prop()
  recruiting: string // ** boolean 으로 처리

  @ApiProperty({
    type: String,
    description: '접수 마감일'
  })
  @Prop()
  deadline: string // ** date로 해두었다가 프론트에서 계산

  @ApiProperty({
    type: String,
    description: '회비'
  })
  @Prop()
  membershipFee: string

  @ApiProperty({
    type: String,
    description: '온/오프'
  })
  @Prop()
  online: string // ** 숫자로 변경 1. 병행 2. 온라인 3. 오프라인

  @ApiProperty({
    type: String,
    description: '지역'
  })
  @Prop()
  location: string

  @ApiProperty({
    type: String,
    description: '활동 기간'
  })
  @Prop()
  period: string
  
  @ApiProperty({
    type: String,
    description: '동아리 소개'
  })
  @Prop()
  introduction: string // ** 긴 텍스트 필요한지 확인

  @ApiProperty({
    type: String,
    description: '특이사항'
  })
  @Prop()
  uniqueness: string // ** 배열로 변경

  @ApiProperty({
    type: String,
    description: '사이트 주소'
  })
  @Prop()
  siteAddress: string

  @ApiProperty({
    type: String,
    description: 'SNS 주소'
  })
  @Prop()
  snsAddress: string

  @ApiProperty({
    type: String,
    description: '활동 요일'
  })
  @Prop()
  activityDay: string

  @ApiProperty({
    type: String,
    description: '선발 절차'
  })
  @Prop()
  selectionProcess: string

  @ApiProperty({
    type: String,
    description: '정원'
  })
  @Prop()
  personnel: string

  @ApiProperty({
    type: String,
    description: '경쟁률'
  })
  @Prop()
  competition: string

  @ApiProperty({
    type: String,
    description: '후기'
  })
  @Prop()
  reviews: string // ** 배열로 변경

  @ApiProperty({
    type: String,
    description: '지원 주소'
  })
  @Prop()
  applyUrl: string
}

export const ClubSchema = SchemaFactory.createForClass(Club);
