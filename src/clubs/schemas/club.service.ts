import { Injectable, Query } from '@nestjs/common';
import { ClubRepository } from './club.repository';

@Injectable()
export class ClubService {
  constructor(
    private readonly clubRepository: ClubRepository
  ){}

  async getClubOne(clubId: number): Promise<any> {
    return this.clubRepository.findClubOne(clubId);
  }

  async addClubInfo(clubId, createSuggestionDto){
    return this.clubRepository.saveClubInfo(clubId, createSuggestionDto);
  }

  async addSuggestion(createSuggestionDto) {
    return this.clubRepository.saveSuggestion(createSuggestionDto);
  }

  async getClubs(@Query() query) {
    // const { category, recruiting, period, activityDay, online } = query;
    // if(category)

    //   await this.clubRepository.
    return this.clubRepository.findAllClub();
  }
}