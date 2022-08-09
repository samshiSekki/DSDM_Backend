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
    const allClub = new Array();
    let allClubs = await this.clubRepository.getAllClub();
    const { category, recruiting, period, activityDay, online } = query;

    // 대카테고리 필터링
    if(category){
      const categories = category.indexOf(",")>=0 ? category.split(",") : category;
      allClubs = allClubs.filter(club => categories.includes(club.mainCategory))
    }

    if(recruiting){
      const recruitings = recruiting.indexOf(",")>=0 ? recruiting.split(",") : recruiting;
      allClubs = allClubs.filter(club => recruitings.includes(club.recruiting))
    }

    // 3개월 이하, 5개월, 1년 이하
    if(period){
      const periods = period.indexOf(",")>=0 ? period.split(",") : period;
      allClubs = allClubs.filter(club => periods.includes(club.period))
    }

    if(online){
      const onlineStatus = online.indexOf(",")>=0 ? online.split(",") : online;
      allClubs = allClubs.filter(club => onlineStatus.includes((club.online).toString()))
    }

    if(activityDay){
      const activityDays = activityDay.indexOf(",")>=0 ? activityDay.split(",") : activityDay;

      if(!(activityDay.indexOf(",")>=0))// 필터링할게 하나면
        allClubs = allClubs.filter(club => (club.activityDay).includes(activityDay));
      else {
        allClubs = allClubs.filter(function() {
          for(let i=0;i<allClubs.length;i++){
            let club = allClubs[i];
            for(let j=0;j<activityDays.length;j++){
              if((club.activityDay).includes(activityDays[j])){
                return true;
              }
            }
            return false;
          }
        });
      }
        // allClubs = allClubs.filter(club => {
        //   activityDays.some((day: string) => {
        //     return (club.activityDay).includes(day)
        //   }) == true
        // });
      // }
      // activityDays.some(day => {
      //   return (club.activityDay).includs(day)
      // })
      // let res = activityDays.some((activityDay: string) => {
      //       return (allClubs[i].activityDay).includes(activityDay)
      //     })
      //     console.log(res);
   
    return allClubs
    }
  }
}