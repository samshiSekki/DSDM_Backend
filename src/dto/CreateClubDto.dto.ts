import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export class CreateClubDto {
  name: string
  mainCategory: string
  subCategory: string[][] 
  target: string
  recruiting: boolean // 모집중 여부
  deadline: string
  membershipFee: string
  online: number // 숫자로 1. 병행 2. 온라인 3. 오프라인
  location: string
  period: string
  introduction: string // 긴 텍스트 필
  uniqueness: string[] //배열
  siteAddress: string
  snsAddress: string
  activityDay: string
  selectionProcess: string
  personnel: string
  competition: string
  reviews: string[]// 배열
  applyUrl: string
  logoUrl: string
}