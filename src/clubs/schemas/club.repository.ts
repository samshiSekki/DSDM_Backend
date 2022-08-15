import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from './club.entity';
import { Suggestion, SuggestionDocument } from './suggestion.entitiy';

export class ClubRepository {
  constructor(
    @InjectModel(Club.name)
    private clubModel: Model<ClubDocument>,
    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,
  ) {}

  async findAllClub(){
    const clubs = await this.clubModel.find();
    const allClub = new Object();   

    for(let club of clubs){
      const {mainCategory} = club;
      allClub[mainCategory] = new Array();
    }

    for(let club of clubs){
      const {clubId, name, recruiting, subCategory, membershipFee, online, period, activityDay, selectionProcess} = club;
      const clubInfo = {
          clubId,
          name,
          subCategory,
          recruiting: (recruiting == true) ?'모집중':'마감',
          membershipFee,
          online: (online == 1)?'온라인':((online==2)?'오프라인':'온/오프라인'),
          period,
          activityDay,
          selectionProcess
      }
      allClub[club.mainCategory].push(clubInfo)
    }
    return allClub;
  }

  async findClubToday(){
    const day = new Date()
    const year = day.getFullYear();
    const month = day.getMonth() + 1;
    const date = day.getDate();

    const today = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;

    //해당 동아리 제외하고 같은 카테고리 내에서 랜덤추출 3개
    const clubToday = await this.clubModel.aggregate([
      { $match: {deadline: today}},
      { $project: {_id:0, clubId:1, name: 1}},
    ])

    return clubToday;

  }

  async saveClub(club: Club){
    await this.clubModel.create(club);
  }
  
  async findClubOne(clubId: number): Promise<any> {
    let result: any[] = [];
    const club = await this.clubModel.findOne({clubId});
    result.push(club);

    //해당 동아리 제외하고 같은 카테고리 내에서 랜덤추출 3개
    const recommend = await this.clubModel.aggregate([
      { $match: {name: {$ne: club.name}, mainCategory: club.mainCategory}},
      { $sample: { size: 5}},
      { $project: {_id:0, clubId:1, name: 1, logoUrl:1 }},
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
}