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

  async addClubInfo(clubId: number, createSuggestionDto){
    return this.clubRepository.saveClubInfo(clubId, createSuggestionDto);
  }

  async addSuggestion(createSuggestionDto) {
    return this.clubRepository.saveSuggestion(createSuggestionDto);
  }

  async getClubs(@Query() query) {
    let allClubs = await this.clubRepository.getAllClub(); // 전체 데이터 다가져옴
    const { category, recruiting, period, activityDay, online } = query;

    // 카테고리로 한번 필터링
    if(category){
      const categories = category.indexOf(",")>=0 ? category.split(",") : category;
      allClubs = allClubs.filter(club => categories.includes(club.mainCategory))
    }

    if(recruiting){
      const recruitings = recruiting.indexOf(",")>=0 ? recruiting.split(",") : recruiting;
      allClubs = allClubs.filter(club => recruitings.includes(club.recruiting))
    }

    if(online){
      const onlineStatus = online.indexOf(",")>=0 ? online.split(",") : online;
      allClubs = allClubs.filter(club => onlineStatus.includes((club.online)))
    }

    // filteredClubByPeriod -> 기간 필터링된 배열 저장 
    let filteredClubByPeriod = new Array();
    let copiedClubs;
    if(period){
      const periods = period.indexOf(",")>=0 ? period.split(",") : period;
      const regex = /[^0-9]/g;
      copiedClubs = JSON.parse(JSON.stringify(allClubs)); // 전체 데이터 깊은 복사 -> copiedClubs
      for(let i=0;i<periods.length;i++){ // 필터링 기간 배열 
        if(periods[i] == 1){
          for(let j=0;j<copiedClubs.length;j++){
            let period = copiedClubs[j].period
            if(period != null){
              let result = parseInt((period || "").replace(regex, ""))
              if((result <= 3 && period.includes("개월")) || 
                  (result/4 <=3 && period.includes("주"))){
                filteredClubByPeriod.push(copiedClubs[j]);
                copiedClubs.splice(j,1)
              }
            }
          }
        } 
        else if (periods[i] == 2){ // 4-6개월
          for(let j=0;j<copiedClubs.length;j++){
            let period = copiedClubs[j].period
            if(period != null){
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
              if((result >=4 && result<=6) && period.includes("개월") ||
                  (period.includes("학기") && result == 1) ||
                  (period.includes("주") && result/4 <=6)){
                    filteredClubByPeriod.push(copiedClubs[j]);
                    copiedClubs.splice(j,1)
              }
            }
          }
        }
        else if (periods[i] == 3){ // 7-11개월
          for(let j=0;j<copiedClubs.length;j++){
            let period = copiedClubs[j].period
            if(period != null){ 
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
              if((result >=7 && result<=11) && period.includes("개월") ||
                (result/4 >=7 && result/4 <=11) && period.includes("주")){
                filteredClubByPeriod.push(copiedClubs[j]);
                copiedClubs.splice(j,1)
              }
            }
          }
        }
        else if (periods[i] == 4){ // 1년 이상
          for(let j=0;j<copiedClubs.length;j++){
            let period = copiedClubs[j].period
            if(period != null){ 
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
              if((result >= 12) && period.includes("개월") ||
                ((result/4 >=12) && period.includes("주")) ||
                ((result >= 2) && period.includes("학기")) ||
                ((result >=1) && period.includes("년"))){
                  filteredClubByPeriod.push(copiedClubs[j]);
                  copiedClubs.splice(j,1)
              }
            }
          }
        }
      }
    }

    // filteredClubByActivityDay -> 활동일자 필터링된 배열 저장 
    let filteredClubByActivityDay = new Array();
    filteredClubByActivityDay = await this.filteringByActivityDay(activityDay, filteredClubByPeriod); 
    
    let finalClub = new Object();
    if(period == null && activityDay == null) 
      return await this.makeFinalClub(finalClub, allClubs)
    return await this.makeFinalClub(finalClub, filteredClubByActivityDay)
  }

  async filteringByActivityDay(activityDay: any, filteredArray: any){
    if(activityDay && filteredArray.length != 0){ 
      console.log("못올텐데")
      const activityDays = activityDay.indexOf(",")>=0 ? activityDay.split(",") : activityDay;
      if(!(activityDay.indexOf(",")>=0)){
        filteredArray = filteredArray.filter(club => (club.activityDay).includes(activityDay));
        return filteredArray
      }
      else {
        let newFilteredArray = new Array();
        console.log(filteredArray.length)
        for(let club of filteredArray){
          for(let activityDay of activityDays){
            if((club.activityDay).includes(activityDay)){
              newFilteredArray.push(club);
            }
          }
        }
        return newFilteredArray
      }
    }
    return filteredArray
  }

  async makeFinalClub(finalClub: object, finalObject: any){
    for(let club of finalObject){
      const {mainCategory} = club;
      finalClub[mainCategory] = new Array();
    }
    
    for(let club of finalObject){
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
      finalClub[club.mainCategory].push(clubInfo)
    }
    return finalClub;
  }

  async getRecruitingClub() {
    return this.clubRepository.findRecruitingClub();
  }
}