import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClubDto } from 'src/dto/CreateClubDto.dto';
import { Club, ClubDocument } from './club.entity';

export class ClubRepository {
  constructor(
    @InjectModel(Club.name)
    private clubModel: Model<ClubDocument>,

  ) {}
    
  async saveClub(createClubDto: CreateClubDto){
    const club = new this.clubModel(createClubDto);
    club.save();
  }     
}