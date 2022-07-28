import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClubDto } from 'src/dto/CreateClubDto.dto';
import { Club, ClubDocument } from './club.entity';
import { Suggestion, SuggestionDocument } from './suggestion.entitiy';

export class ClubRepository {
  constructor(
    @InjectModel(Club.name)
    private clubModel: Model<ClubDocument>,
    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,
  ) {}
    
  async saveClub(createClubDto: CreateClubDto){
    const club = new this.clubModel(createClubDto);
    club.save();
  }
  
  async findClubOne(clubId): Promise<any> {
    let result: any[] = [];
    const club = await this.clubModel.findById(clubId);
    result.push(club);

    //해당 동아리 제외하고 같은 카테고리 내에서 랜덤추출 3개
    const recommend = await this.clubModel.aggregate([
      { $match: {name: {$ne: club.name}, category: club.category[0]}},
      // { $match: {name: {$ne: club.name}, category: club.category}},
      { $sample: { size: 3}},
      { $project: {_id:1, name: 1}},
    ])
    
    result.push(recommend);
    return result;
  }

  async saveClubInfo(clubId, createSuggestionDto) {
    const club = await this.clubModel.findById(clubId);
    createSuggestionDto.name = club.name;
    const suggestion = await new this.suggestionModel(createSuggestionDto);
    suggestion.save();
    return suggestion;
  }

  async saveSuggestion(createSuggestionDto) {
    const suggestion = await new this.suggestionModel(createSuggestionDto);
    suggestion.save();
    return suggestion;
  }

  async findAllClub(){
    return await this.clubModel.find();
  }
}