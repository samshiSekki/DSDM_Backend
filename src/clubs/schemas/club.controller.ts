import { Controller, Get, Post } from "@nestjs/common";
import { ExcelService } from "src/excel/excel.service";

@Controller()
export class ClubController {
  constructor(
    private readonly excelService: ExcelService
    ) {}


  @Get(process.env.EXCEL_ROUTER)
  readExcelFile() {
    this.excelService.readExcelFile();
  }

  @Get("/clubs")
  getClubs(){
    // this.clubService.getClubs();
  }
}
