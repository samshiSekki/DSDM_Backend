import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Club } from 'src/clubs/schemas/club.entity';
import { ClubRepository } from 'src/clubs/schemas/club.repository';

@Injectable()
export class ExcelService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async readExcelFile(){
    const xlsxFile = require('read-excel-file/node');
 
    xlsxFile(`./${process.env.FILE}`).then((rows: { [x: string]: any[]; }): void => {
      for(let i in rows){
        let name = rows[i][0];
        let mainCategory = rows[i][1];
        let categories = rows[i][2].split("/");
        let finalCategory = new Array();

        for(let category of categories){ // category = 개발(백엔드, 웹 프론트엔드)  / 기획 / 디자인
          if(category.includes("(")) { // 개발(백엔드, 웹 프론트엔드)
            let start = category.indexOf("(")
            let middleCategory = category.substring(0, start) // 중분류 (개발, 디자인 ...)
            let subCategories = category.substring(start+1, category.length-1).split(", ") // 소분류 (백엔드, 프론트엔드, 안드로이드 ...)

            let subArray = new Array();
            for(let subCategory of subCategories){ // 소분류 (백엔드, 프론트엔드, 안드로이드 ...)
              subArray.push(subCategory);
            }

            let subObject = new Object();
            subObject[middleCategory] = subArray;
            finalCategory.push(subObject);
          }
          else
            finalCategory.push(category)
        }
        let target = rows[i][3];
        let recruiting = rows[i][4] == '모집중' ? true : false;          
        let deadline = rows[i][5];
        let membershipFee = rows[i][6];
        let online = rows[i][7];
        
        if(online == '온라인')
          online = 1;
        else if(online == '오프라인')
          online = 2;
        else if(online == '온/오프라인')
          online = 3;

        let location = rows[i][8];
        let period = rows[i][9];
        let introduction = rows[i][10];
        let uniqueness = (rows[i][11] || '').split("\n");
        let uniqueObject = new Array();
        for(let unique of uniqueness){
          uniqueObject.push(unique)
        }
        let siteAddress = rows[i][12];
        let snsAddress = rows[i][13];
        let activityDay = rows[i][14];
        let selectionProcess = rows[i][15];
        let personnel = rows[i][16];
        let competition = rows[i][17];
        let reviews = (rows[i][18] || '').split("\n");
        let reviewObject = new Array();
        for(let review of reviews){
          reviewObject.push(review)
        }
        let applyUrl = rows[i][19]
        let logoUrl = rows[i][20]

        const club = {
          "clubId": Number(i)+Number(1),
          "name": name,
          "mainCategory": mainCategory,
          "subCategory": finalCategory,
          "target": target,
          "recruiting": recruiting,
          "deadline": deadline,
          "membershipFee": membershipFee,
          "online": online,
          "location": location,
          "period": period,
          "introduction": introduction,
          "uniqueness": uniqueness,
          "siteAddress": siteAddress,
          "snsAddress": snsAddress,
          "activityDay": activityDay,
          "selectionProcess": selectionProcess,
          "personnel": personnel,
          "competition": competition,
          "reviews": reviews,
          "applyUrl": applyUrl,
          "logoUrl": logoUrl
        }
        this.clubRepository.saveClub(plainToClass(Club, club));
      }
    })
  }
}
