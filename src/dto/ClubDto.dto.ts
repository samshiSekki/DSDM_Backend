export class ClubDto {
    name: string
    subCategory: string[][] 
    recruiting: boolean // 모집중 여부
    membershipFee: string
    online: number // 숫자로 1. 병행 2. 온라인 3. 오프라인
    period: string
    activityDay: string
    selectionProcess: string
}