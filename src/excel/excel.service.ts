import { Injectable } from '@nestjs/common';
import { ClubRepository } from 'src/clubs/schemas/club.repository';

@Injectable()
export class ExcelService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async readExcelFile(){
    const xlsxFile = require('read-excel-file/node');
 
    xlsxFile(`./${process.env.FILE}`).then((rows) => {
      for(let i in rows){
        const club = {
          "name": rows[i][0],
          "category": rows[i][1],
          "target": rows[i][2],
          "recruiting": rows[i][3],
          "deadline": rows[i][4],
          "membershipFee": rows[i][5],
          "online": rows[i][6],
          "location": rows[i][7],
          "period": rows[i][8],
          "introduction": rows[i][9],
          "uniqueness": rows[i][10],
          "siteAddress": rows[i][11],
          "snsAddress": rows[i][12],
          "activityDay": rows[i][13],
          "selectionProcess": rows[i][14],
          "personnel": rows[i][15],
          "competition": rows[i][16],
          "reviews": rows[i][17],
          "applyUrl": rows[i][18],
        }
        this.clubRepository.saveClub(club);
      }
    })
  }
}
