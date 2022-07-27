import { Injectable } from '@nestjs/common';
import { ClubRepository } from './club.repository';
import { Club } from './club.entity';

@Injectable()
export class ClubService {

  constructor(
    private readonly clubRepository: ClubRepository
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async getClubOne(clubId): Promise<any> {
    return this.clubRepository.findClubOne(clubId);
  }

  async addSuggestion(createSuggestionDto) {
    return this.clubRepository.saveSuggestion(createSuggestionDto);
  }
}