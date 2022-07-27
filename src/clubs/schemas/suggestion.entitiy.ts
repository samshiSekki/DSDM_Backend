import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema()
export class Suggestion {

  @ApiProperty({
    type: mongoose.Schema.Types.ObjectId,
    description: 'Suggestion Entity의 ObjectId',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: '요청 사항 내용'
  })
  @Prop()
  content: string;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
