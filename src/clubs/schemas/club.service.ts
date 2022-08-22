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
    let allClubs = await this.clubRepository.getAllClub(); // 전체 데이터 다가져옴
    const { category, recruiting, period, activityDay, online } = query;

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
      allClubs = allClubs.filter(club => onlineStatus.includes((club.online).toString()))
    }


// 3개월
// 1년
// 5개월
// 2년
// 3학기 -> 1년 반 

// 학기단위 모집, 1년 활동시 정회원 자격 부여
// 23년 1학기까지

// 17주 = 4개월 


    // 3개월 이하 / 4-6개월 / 7개월-1년 / 1년 이상
    // period=1,2,3,4
    let filteredClubByPeriod = new Array();

    if(period){
      const periods = period.indexOf(",")>=0 ? period.split(",") : period;
      const regex = /[^0-9]/g;
      let copiedClubs = JSON.parse(JSON.stringify(allClubs));
      // 1,2 개월 -> 6개월 미만인거 다 ...
      for(let i=0;i<periods.length;i++){
        if(periods[i] == 1){
          for(let club of copiedClubs){
            let period = club.period
            if(period != null){
              let result = parseInt((period || "").replace(regex, ""))
              if(result <= 3 && period.includes("개월")){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              }
              else if(result/4 <=3 && period.includes("주")){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              } 
            }
          }
        } 
        else if (periods[i] == 2){ // 4-6개월
          for(let club of copiedClubs){
            let period = club.period
            if(period != null){
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
      
              if((result >=4 && result<=6) && period.includes("개월")){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              }
              else if(period.includes("학기") && result == 1){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              }
              else if(period.includes("주") && result/4 <=6){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              }
            }
          }
        }
        else if (periods[i] == 3){ // 7-11개월
          for(let club of copiedClubs){
            let period = club.period
            if(period != null){ 
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
      
              if((result >=7 && result<=11) && period.includes("개월")){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              }
              else if((result/4 >=7 && result/4 <=11) && period.includes("주")){
                filteredClubByPeriod.push(club);
                copiedClubs.splice(i,1);
              }
            }
          }
        }
        else if (periods[i] == 4){ // 7-11개월
          for(let club of copiedClubs){
            let period = club.period
            if(period != null){ 
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
      
              if((result >= 12) && period.includes("개월"))
                filteredClubByPeriod.push(club);
              else if((result/4 >=12) && period.includes("주"))
                filteredClubByPeriod.push(club);
              else if((result >= 2) && period.includes("학기")){
                filteredClubByPeriod.push(club);
              }
              else if((result >=1) && period.includes("년")){
                filteredClubByPeriod.push(club);
              }
            }
          }
        }
      }
      return filteredClubByPeriod
    }

    let filteredClub = new Array();

    if(activityDay){
      const activityDays = activityDay.indexOf(",")>=0 ? activityDay.split(",") : activityDay;
    
      if(!(activityDay.indexOf(",")>=0))
        allClubs = allClubs.filter(club => (club.activityDay).includes(activityDay));
      else {
        for(let club of allClubs){
          for(let activityDay of activityDays){
            if((club.activityDay).includes(activityDay)){
              filteredClub.push(club);
              break;
            }
          }
        }
      }
    }

    if(filteredClub.length == 0 )
      return allClubs;
    
    for(let club of filteredClub){
      const {mainCategory} = club;
      allClub[mainCategory] = new Array();
    }

    console.log(allClub)
    for(let club of filteredClub){
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
    return allClub
  }
}