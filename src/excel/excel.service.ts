import { Injectable } from '@nestjs/common';
import { ClubRepository } from 'src/clubs/schemas/club.repository';

@Injectable()
export class ExcelService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async readExcelFile(){
    const xlsxFile = require('read-excel-file/node');
 
    xlsxFile(`./${process.env.FILE}`).then((rows) => {
      for(let i in rows){
        let name = rows[i][0];
        let mainCategory = rows[i][1];
        let subCategories = rows[i][2].split("/")

        let cate = new Array();

        for(let subCategory of subCategories){
          if(subCategory.includes("(")) {
            let start = subCategory.indexOf("(")
            let category = subCategory.substring(0, start) // 중분류 (개발, 디자인 ...)
            
            let objects = subCategory.substring(start+1, subCategory.length-1).split(", ")
              
            let subzz = new Array();
            for(let object of objects){ // 소분류 (백엔드, 프론트엔드, 안드로이드 ...)
              subzz.push(object);
            }
            subCategory = new Object();
            subCategory[category] = subzz;
            
          }
          cate.push(subCategory)
        }
        console.log(cate)
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
        let reviews = rows[i][18].split("\n");
        let reviewObject = new Array();
        for(let review of reviews){
          reviewObject.push(review)
        }
        let applyUrl = rows[i][19]
        let logoUrl = rows[i][20]

        const club = {
          "name": name,
          "mainCategory":mainCategory,
          "subCategory": cate,
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
       this.clubRepository.saveClub(club);
      }
    })
  }
}
