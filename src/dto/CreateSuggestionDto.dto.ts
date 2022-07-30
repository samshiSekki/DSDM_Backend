import { ApiProperty } from "@nestjs/swagger";

export class CreateSuggestionDto {

@ApiProperty({
    type: String,
    description: '요청 사항 내용'
    })
  content: string

  @ApiProperty({
    type: String,
    description: '요청 동아리 이름'
    })
  name:string
}