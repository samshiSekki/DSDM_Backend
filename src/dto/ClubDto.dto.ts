export class ClubDto {
    name: string
    subCategory: string[][] 
    recruiting: boolean // 모집중 여부
    membershipFee: string
    online: number // 숫자로 1. 병행 2. 온라인 3. 오프라인
    period: string
    activityDay: string
    selectionProcess: string

    get getOnAndOff(): string {
      let onlineStatus = this.online;
      if(onlineStatus == 1)
        return '온라인'
      else if(onlineStatus == 2)
        return '오프라인'
      else if(onlineStatus == 3)
        return '온/오프라인' 
    }
  
    get getRecruting(): string {
      let recruitStatus = this.recruiting
      if(recruitStatus == true)
        return '모집중'
      else 
        return '마감'
    }
  }