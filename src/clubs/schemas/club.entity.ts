import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import internal from 'stream';

export type ClubDocument = Club & Document;

@Schema()
export class Club {
  @Prop()
  name: string

  @Prop()
  category: string // ** 소분류로도 필터링 가능한지 물어보고 배열로 변경

  @Prop()
  target: string

  @Prop()
  recruiting: string // ** boolean 으로 처리

  @Prop()
  deadline: string // ** date로 해두었다가 프론트에서 계산

  @Prop()
  membershipFee: string

  @Prop()
  online: string // ** 숫자로 변경 1. 병행 2. 온라인 3. 오프라인

  @Prop()
  location: string

  @Prop()
  period: string
  
  @Prop()
  introduction: string // ** 긴 텍스트 필요한지 확인

  @Prop()
  uniqueness: string // ** 배열로 변경

  @Prop()
  siteAddress: string

  @Prop()
  snsAddress: string

  @Prop()
  activityDay: string

  @Prop()
  selectionProcess: string

  @Prop()
  personnel: string

  @Prop()
  competition: string

  @Prop()
  reviews: string // ** 배열로 변경

  @Prop()
  applyUrl: string
}

export const ClubSchema = SchemaFactory.createForClass(Club);
