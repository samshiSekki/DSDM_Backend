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
      allClubs = allClubs.filter(club => onlineStatus.includes((club.online).toString()))
    }

    // 3개월 이하 / 4-6개월 / 7개월-1년 / 1년 이상 ( period = 1,2,3,4)
    console.log("3개필터링"+allClubs.length)

    // filteredClubByPeriod -> 기간필터링된 배열 저장 
    let filteredClubByPeriod = new Array();
    let copiedClubs;
    if(period){
      const periods = period.indexOf(",")>=0 ? period.split(",") : period;
      const regex = /[^0-9]/g;
      copiedClubs = JSON.parse(JSON.stringify(allClubs)); // 전체 데이터 깊은 복사 -> copiedClubs
      for(let i=0;i<periods.length;i++){ // 필터링 기간 배열 
        if(periods[i] == 1){
          for(let club of copiedClubs){
            let period = club.period
            if(period != null){
              let result = parseInt((period || "").replace(regex, ""))
              if(result <= 3 && period.includes("개월")){
                filteredClubByPeriod.push(club);
              }
              else if(result/4 <=3 && period.includes("주")){
                filteredClubByPeriod.push(club);
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
              }
              else if(period.includes("학기") && result == 1){
                filteredClubByPeriod.push(club);
              }
              else if(period.includes("주") && result/4 <=6){
                filteredClubByPeriod.push(club);
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
              }
              else if((result/4 >=7 && result/4 <=11) && period.includes("주")){
                filteredClubByPeriod.push(club);
              }
            }
          }
        }
        else if (periods[i] == 4){ // 7-11개월
          for(let club of copiedClubs){
            let period = club.period
            if(period != null){ 
              let result = parseInt((period || "").replace(regex, "")) // 숫자만 추출
              if((result >= 12) && period.includes("개월")){
                filteredClubByPeriod.push(club);
              }
              else if((result/4 >=12) && period.includes("주")){
                filteredClubByPeriod.push(club);
              }
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
    }

//    console.log(filteredClubByPeriod)

    // filteredClubByActivityDay -> 활동일자로 필터링
    let filteredClubByActivityDay = new Array();

    if(filteredClubByPeriod.length == 0) { // 기간 필터링이 안됐으면 -> allClubs 로 필터링해야함
      console.log("기간 필터링 xx")
      if(activityDay){
        const activityDays = activityDay.indexOf(",")>=0 ? activityDay.split(",") : activityDay;
        
        console.log(...activityDays) // 여기가 이상함 
        console.log(activityDays.length)
        if(!(activityDay.indexOf(",")>=0)){
          console.log("오나?")
          allClubs = allClubs.filter(club => (club.activityDay).includes(activityDay));
        }
        else {
          for(let club of allClubs){
            for(let activityDay of activityDays){
              if((club.activityDay).includes(activityDay)){
                allClubs.push(club);
                break;
              }
            }
          }
        }
      }
    }
    else{ // 기간 필터링이 됐으면 -> filteredClubByPeriod 로 필터링해야함
      console.log("기간 필터링 00")
      if(activityDay){
        const activityDays = activityDay.indexOf(",")>=0 ? activityDay.split(",") : activityDay;
        
        console.log(...activityDays) // 여기가 이상함 
        console.log(activityDays.length)
        if(!(activityDay.indexOf(",")>=0)){
          console.log("오나?")
          filteredClubByPeriod = filteredClubByPeriod.filter(club => (club.activityDay).includes(activityDay));
          console.log("byperiod2"+filteredClubByPeriod.length);
        }
        else {
          for(let club of filteredClubByPeriod){
            for(let activityDay of activityDays){
              if((club.activityDay).includes(activityDay)){
                filteredClubByActivityDay.push(club);
                break;
              }
            }
          }
        }
      }
    }
    let finalClub = new Object();


// ActivityDay.length == 0 && period !=0 --> period 로 해야함 
// activityDay.length == 0 && period == 0 --> allclubs로
// activityDay.length !=0 && period == 0 -> allclubs
// acitivyday.length !=0 && peiord !=0 -> activity로 

    if(filteredClubByPeriod.length==0){ // filtered 로 해야함 
      for(let club of allClubs){
        const {mainCategory} = club;
        finalClub[mainCategory] = new Array();
      }
      
      for(let club of allClubs){
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
    } 
    else if(filteredClubByPeriod.length !=0 && filteredClubByActivityDay.length ==0){
      for(let club of filteredClubByPeriod){
        const {mainCategory} = club;
        finalClub[mainCategory] = new Array();
      }

      for(let club of filteredClubByPeriod){
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
    }
    else if(filteredClubByPeriod.length !=0 && filteredClubByActivityDay.length !=0){
      for(let club of filteredClubByActivityDay){
        const {mainCategory} = club;
        finalClub[mainCategory] = new Array();
      }
      
      for(let club of filteredClubByActivityDay){
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
    }
    return finalClub
  }

  async getClubsToday() {
    return this.clubRepository.findClubToday();
  }
}